<?php

namespace App\Http\Controllers;

use App\Models\PromoCode;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PromoCodeController extends Controller
{
    public function index(Request $request): Response
    {
        $promoCodes = PromoCode::query()
            ->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('dashboard/promo-codes/index', [
            'promoCodes' => $promoCodes,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'code' => ['required', 'string', 'max:50', 'unique:promo_codes,code'],
            'description' => ['nullable', 'string'],
            'discount_type' => ['required', 'string', 'in:percentage,fixed'],
            'discount_value' => ['required', 'integer', 'min:1'],
            'min_order_subtotal' => ['nullable', 'integer', 'min:0'],
            'max_discount_amount' => ['nullable', 'integer', 'min:0'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'max_uses' => ['nullable', 'integer', 'min:1'],
            'is_active' => ['boolean'],
        ]);

        $code = strtoupper(trim($validated['code']));

        PromoCode::create([
            'uuid' => Str::uuid(),
            'code' => $code,
            'name' => $code,
            'description' => $validated['description'] ?? null,
            'type' => $validated['discount_type'],
            'value' => $validated['discount_value'],
            'min_order_total' => $validated['min_order_subtotal'] ?? 0,
            'max_discount_amount' => $validated['max_discount_amount'] ?? null,
            'starts_at' => $validated['starts_at'] ?? null,
            'ends_at' => $validated['ends_at'] ?? null,
            'max_uses' => $validated['max_uses'] ?? null,
            'used_count' => 0,
            'is_active' => $validated['is_active'] ?? true,
            'created_by' => $request->user()->id,
        ]);

        return redirect()->route('promo-codes.index')
            ->with('success', 'Kode promo berhasil dibuat.');
    }

    public function update(Request $request, PromoCode $promoCode): RedirectResponse
    {
        $validated = $request->validate([
            'description' => ['nullable', 'string'],
            'discount_type' => ['sometimes', 'required', 'string', 'in:percentage,fixed'],
            'discount_value' => ['sometimes', 'required', 'integer', 'min:1'],
            'min_order_subtotal' => ['nullable', 'integer', 'min:0'],
            'max_discount_amount' => ['nullable', 'integer', 'min:0'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'max_uses' => ['nullable', 'integer', 'min:1'],
            'is_active' => ['boolean'],
        ]);

        $promoCode->update([
            'description' => $validated['description'] ?? $promoCode->description,
            'type' => $validated['discount_type'] ?? $promoCode->type->value,
            'value' => $validated['discount_value'] ?? $promoCode->value,
            'min_order_total' => $validated['min_order_subtotal'] ?? $promoCode->min_order_total,
            'max_discount_amount' => $validated['max_discount_amount'] ?? $promoCode->max_discount_amount,
            'starts_at' => $validated['starts_at'] ?? $promoCode->starts_at,
            'ends_at' => $validated['ends_at'] ?? $promoCode->ends_at,
            'max_uses' => $validated['max_uses'] ?? $promoCode->max_uses,
            'is_active' => array_key_exists('is_active', $validated) ? $validated['is_active'] : $promoCode->is_active,
        ]);

        return redirect()->route('promo-codes.index')
            ->with('success', 'Kode promo berhasil diperbarui.');
    }

    public function toggle(PromoCode $promoCode): RedirectResponse
    {
        $promoCode->update(['is_active' => ! $promoCode->is_active]);

        $label = $promoCode->is_active ? 'diaktifkan' : 'dinonaktifkan';

        return redirect()->route('promo-codes.index')
            ->with('success', "Kode promo berhasil {$label}.");
    }

    public function destroy(PromoCode $promoCode): RedirectResponse
    {
        $promoCode->delete();

        return redirect()->route('promo-codes.index')
            ->with('success', 'Kode promo berhasil dihapus.');
    }
}
