<?php

namespace App\Http\Controllers\Api;

use App\Enums\Role;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\LoginRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * Issue a Sanctum token for an eligible staff account.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $credentials = $request->only('email', 'password');

        if (! Auth::guard('web')->attempt($credentials)) {
            return response()->json([
                'message' => 'Kredensial tidak valid.',
            ], 422);
        }

        /** @var User $user */
        $user = Auth::guard('web')->user();

        // Only operational staff (Surabaya/Ende) and admins may use the mobile API.
        $allowed = $user->hasAnyRole([
            Role::StaffSurabaya->value,
            Role::StaffEnde->value,
            Role::Admin->value,
        ]);

        if (! $allowed) {
            Auth::guard('web')->logout();

            return response()->json([
                'message' => 'Akun ini tidak memiliki akses ke aplikasi lapangan.',
            ], 403);
        }

        $token = $user->createToken('mobile')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user->only(['uuid', 'name', 'email']),
            'permissions' => $user->getAllPermissions()->pluck('name')->values(),
        ]);
    }

    /**
     * Return the currently authenticated user.
     */
    public function user(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'user' => $user->only(['uuid', 'name', 'email']),
            'permissions' => $user->getAllPermissions()->pluck('name')->values(),
        ]);
    }

    /**
     * Revoke the token used for the request.
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Berhasil keluar.']);
    }
}
