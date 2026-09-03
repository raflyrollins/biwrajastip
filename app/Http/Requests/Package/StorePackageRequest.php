<?php

namespace App\Http\Requests\Package;

use App\Enums\Permission;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePackageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can(Permission::ActionPackagesCreate->value);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'store_tracking_number' => ['required', 'string', 'max:100'],
            'receiver_name' => ['required', 'string', 'max:150'],
            'delivery_zone_id' => ['nullable', 'integer', Rule::exists('delivery_zones', 'id')->where('is_active', true)],
            'delivery_address' => ['required', 'string', 'max:255'],
            'estimated_weight_g' => ['required', 'integer', 'min:1', 'max:100000'],
            'estimated_length_cm' => ['nullable', 'numeric', 'min:0'],
            'estimated_width_cm' => ['nullable', 'numeric', 'min:0'],
            'estimated_height_cm' => ['nullable', 'numeric', 'min:0'],
        ];
    }

    /**
     * Get custom message in Indonesian.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'store_tracking_number.required' => 'Nomor resi toko online wajib diisi.',
            'receiver_name.required' => 'Nama penerima wajib diisi.',
            'delivery_zone_id.exists' => 'Zona tujuan tidak valid.',
            'delivery_address.required' => 'Alamat di Ende wajib diisi.',
            'estimated_weight_g.required' => 'Estimasi berat (gram) wajib diisi.',
            'estimated_weight_g.integer' => 'Estimasi berat harus berupa bilangan bulat (gram).',
            'estimated_weight_g.min' => 'Estimasi berat harus lebih dari 0 gram.',
        ];
    }
}
