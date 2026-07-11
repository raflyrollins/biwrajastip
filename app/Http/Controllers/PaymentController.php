<?php

namespace App\Http\Controllers;

use App\Enums\PackageStatus;
use App\Enums\PaymentStatus;
use App\Models\Package;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $perPage = min((int) $request->get('per_page', 20), 100);

        $query = Payment::with(['package', 'user'])
            ->orderByRaw("FIELD(status, 'pending') DESC")
            ->latest();

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('user', fn ($q) => $q->where('name', 'like', "%{$search}%"))
                  ->orWhereHas('package', fn ($q) => $q->where('tracking_number', 'like', "%{$search}%"));
            });
        }

        if ($dateFrom = $request->get('date_from')) {
            $query->whereDate('created_at', '>=', $dateFrom);
        }

        if ($dateTo = $request->get('date_to')) {
            $query->whereDate('created_at', '<=', $dateTo);
        }

        if ($year = $request->get('year')) {
            $query->whereYear('created_at', $year);
        }

        $payments = $query->paginate($perPage)->onEachSide(1);

        return Inertia::render('dashboard/payments/Index', [
            'payments' => $payments,
        ]);
    }

    public function create()
    {
        $packageUuid = request('package');

        $package = auth()->user()->packages()
            ->where('uuid', $packageUuid)
            ->where('status', PackageStatus::WaitingForPayment)
            ->with('zone')
            ->firstOrFail();

        $existingPayment = Payment::where('package_id', $package->id)
            ->where('user_id', auth()->id())
            ->latest()
            ->first();

        $paymentData = null;
        if ($existingPayment) {
            if ($existingPayment->status === PaymentStatus::Pending) {
                $paymentData = [
                    'status' => 'pending',
                    'created_at' => $existingPayment->created_at->toISOString(),
                ];
            } elseif ($existingPayment->status === PaymentStatus::Rejected) {
                $paymentData = [
                    'status' => 'rejected',
                    'notes' => $existingPayment->notes,
                    'created_at' => $existingPayment->created_at->toISOString(),
                ];
            }
        }

        return Inertia::render('dashboard/payments/Form', [
            'package' => [
                'uuid' => $package->uuid,
                'tracking_number' => $package->tracking_number,
                'tracking_number_biwra' => $package->tracking_number_biwra,
                'total_price' => (float) $package->total_price,
                'price' => (float) $package->price,
                'delivery_fee' => (float) $package->delivery_fee,
                'final_weight' => $package->final_weight ? (float) $package->final_weight : null,
                'weight_actual' => $package->weight_actual ? (float) $package->weight_actual : null,
                'receiver_name' => $package->receiver_name,
                'zone_name' => $package->zone?->name,
            ],
            'existingPayment' => $paymentData,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'package_id' => ['required', 'exists:packages,uuid'],
            'amount' => ['required', 'numeric', 'min:0'],
            'payment_method' => ['nullable', 'string', 'max:100'],
            'proof_image' => ['nullable', 'image', 'mimes:jpeg,png,jpg', 'max:5120'],
        ]);

        $package = Package::where('uuid', $validated['package_id'])
            ->where('user_id', auth()->id())
            ->firstOrFail();

        if ($package->status->value !== PackageStatus::WaitingForPayment->value) {
            return back()->with('error', 'Paket tidak dalam status menunggu pembayaran.');
        }

        $existingPayment = Payment::where('package_id', $package->id)
            ->where('user_id', auth()->id())
            ->latest()
            ->first();

        if ($existingPayment && $existingPayment->status === PaymentStatus::Pending) {
            return back()->with('error', 'Bukti pembayaran sudah dikirim. Mohon tunggu verifikasi dari admin.');
        }

        $proofPath = null;
        if ($request->hasFile('proof_image')) {
            $proofPath = $this->compressAndStore($request->file('proof_image'));
        }

        if ($existingPayment && $existingPayment->status === PaymentStatus::Rejected) {
            $updateData = [
                'amount' => $validated['amount'],
                'payment_method' => $validated['payment_method'] ?? null,
                'status' => PaymentStatus::Pending,
                'notes' => null,
            ];

            if ($proofPath) {
                $oldRaw = $existingPayment->getRawOriginal('proof_image');
                if ($oldRaw && ! str_contains($oldRaw, '://')) {
                    Storage::disk('public')->delete($oldRaw);
                }
                $updateData['proof_image'] = $proofPath;
            }

            $existingPayment->update($updateData);
        } else {
            Payment::create([
                'package_id' => $package->id,
                'user_id' => auth()->id(),
                'amount' => $validated['amount'],
                'payment_method' => $validated['payment_method'] ?? null,
                'proof_image' => $proofPath,
                'status' => PaymentStatus::Pending,
            ]);
        }

        return redirect()->route('dashboard.packages')->with('success', 'Bukti pembayaran berhasil dikirim.');
    }

    public function verify($uuid)
    {
        $payment = Payment::where('uuid', $uuid)->firstOrFail();

        if ($payment->status !== PaymentStatus::Pending) {
            return back()->with('error', 'Pembayaran sudah diverifikasi.');
        }

        $payment->update([
            'status' => PaymentStatus::Verified,
            'verified_by' => auth()->id(),
            'verified_at' => now(),
        ]);

        $payment->package->update([
            'status' => PackageStatus::Paid,
        ]);

        return redirect()->route('dashboard.payments')->with('success', 'Pembayaran berhasil diverifikasi.');
    }

    public function reject(Request $request, $uuid)
    {
        $validated = $request->validate([
            'notes' => ['required', 'string', 'max:1000'],
        ]);

        $payment = Payment::where('uuid', $uuid)->firstOrFail();

        if ($payment->status !== PaymentStatus::Pending) {
            return back()->with('error', 'Pembayaran sudah diverifikasi atau ditolak.');
        }

        $payment->update([
            'status' => PaymentStatus::Rejected,
            'notes' => $validated['notes'],
            'verified_by' => auth()->id(),
            'verified_at' => now(),
        ]);

        return redirect()->route('dashboard.payments')->with('success', 'Pembayaran ditolak.');
    }

    private function compressAndStore(UploadedFile $image): string
    {
        $maxWidth = 1920;
        $maxHeight = 1920;
        $quality = 70;

        $source = match ($image->guessExtension()) {
            'png' => @imagecreatefrompng($image->getRealPath()),
            default => @imagecreatefromjpeg($image->getRealPath()),
        };

        if (! $source) {
            $stored = $image->store('payments', 'public');

            return is_string($stored) ? $stored : '';
        }

        $origWidth = imagesx($source);
        $origHeight = imagesy($source);

        $ratio = min($maxWidth / $origWidth, $maxHeight / $origHeight, 1);
        $newWidth = max(1, (int) round($origWidth * $ratio));
        $newHeight = max(1, (int) round($origHeight * $ratio));

        $canvas = imagecreatetruecolor($newWidth, $newHeight);
        imagecopyresampled($canvas, $source, 0, 0, 0, 0, $newWidth, $newHeight, $origWidth, $origHeight);

        $filename = 'payments/'.Str::uuid()->toString().'.jpg';
        $tempPath = tempnam(sys_get_temp_dir(), 'payment');
        imagejpeg($canvas, $tempPath, $quality);
        imagedestroy($canvas);
        imagedestroy($source);

        $handle = fopen($tempPath, 'rb');

        if ($handle) {
            Storage::disk('public')->put($filename, $handle);
            fclose($handle);
            unlink($tempPath);

            return $filename;
        }

        unlink($tempPath);

        $stored = $image->store('payments', 'public');

        return is_string($stored) ? $stored : '';
    }
}
