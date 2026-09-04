<?php

namespace App\Http\Controllers;

use App\Models\Promotion;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PromotionController extends Controller
{
    public function index(Request $request): Response
    {
        $promotions = Promotion::query()
            ->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('dashboard/promotions/index', [
            'promotions' => $promotions,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'discount_type' => ['required', 'string', 'in:percentage,fixed'],
            'discount_value' => ['required', 'integer', 'min:1'],
            'min_order_subtotal' => ['nullable', 'integer', 'min:0'],
            'max_discount_amount' => ['nullable', 'integer', 'min:0'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'is_active' => ['boolean'],
        ]);

        Promotion::create([
            'uuid' => Str::uuid(),
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'type' => $validated['discount_type'],
            'value' => $validated['discount_value'],
            'min_order_total' => $validated['min_order_subtotal'] ?? 0,
            'max_discount_amount' => $validated['max_discount_amount'] ?? null,
            'starts_at' => $validated['starts_at'] ?? null,
            'ends_at' => $validated['ends_at'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
            'created_by' => $request->user()->id,
        ]);

        return redirect()->route('promotions.index')
            ->with('success', 'Promosi berhasil dibuat.');
    }

    public function update(Request $request, Promotion $promotion): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'discount_type' => ['sometimes', 'required', 'string', 'in:percentage,fixed'],
            'discount_value' => ['sometimes', 'required', 'integer', 'min:1'],
            'min_order_subtotal' => ['nullable', 'integer', 'min:0'],
            'max_discount_amount' => ['nullable', 'integer', 'min:0'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'is_active' => ['boolean'],
        ]);

        $promotion->update([
            'name' => $validated['name'] ?? $promotion->name,
            'description' => $validated['description'] ?? $promotion->description,
            'type' => $validated['discount_type'] ?? $promotion->type->value,
            'value' => $validated['discount_value'] ?? $promotion->value,
            'min_order_total' => $validated['min_order_subtotal'] ?? $promotion->min_order_total,
            'max_discount_amount' => $validated['max_discount_amount'] ?? $promotion->max_discount_amount,
            'starts_at' => $validated['starts_at'] ?? $promotion->starts_at,
            'ends_at' => $validated['ends_at'] ?? $promotion->ends_at,
            'is_active' => array_key_exists('is_active', $validated) ? $validated['is_active'] : $promotion->is_active,
        ]);

        return redirect()->route('promotions.index')
            ->with('success', 'Promosi berhasil diperbarui.');
    }

    public function toggle(Promotion $promotion): RedirectResponse
    {
        $promotion->update(['is_active' => ! $promotion->is_active]);

        $label = $promotion->is_active ? 'diaktifkan' : 'dinonaktifkan';

        return redirect()->route('promotions.index')
            ->with('success', "Promosi berhasil {$label}.");
    }

    public function destroy(Promotion $promotion): RedirectResponse
    {
        $promotion->delete();

        return redirect()->route('promotions.index')
            ->with('success', 'Promosi berhasil dihapus.');
    }
}
