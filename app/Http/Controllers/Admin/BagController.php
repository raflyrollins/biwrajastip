<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Bag;
use App\Models\Package;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BagController extends Controller
{
    public function index(Request $request): Response
    {
        $bags = Bag::with('batch')
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/bags', [
            'bags' => $bags,
        ]);
    }

    public function print(Bag $bag): Response
    {
        $bag->load('batch');

        return Inertia::render('staff-surabaya/print-bag', [
            'bag' => $bag,
        ]);
    }

    public function destroy(Bag $bag)
    {
        Package::where('bag_id', $bag->id)->update([
            'bag_id' => null,
            'status' => 'paid',
        ]);

        $bag->delete();

        return redirect()->route('admin.bags')->with('success', 'Bag berhasil dihapus.');
    }
}
