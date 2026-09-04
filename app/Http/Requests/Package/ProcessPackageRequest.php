<?php

namespace App\Http\Requests\Package;

use App\Enums\Permission;
use Illuminate\Foundation\Http\FormRequest;

class ProcessPackageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can(Permission::ActionPackagesProcess->value)
            && $this->user()->getRoleNames()->contains('staff-surabaya');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'actual_weight_g' => ['required', 'integer', 'min:1', 'max:100000'],
            'actual_length_cm' => ['nullable', 'numeric', 'min:0', 'max:240'],
            'actual_width_cm' => ['nullable', 'numeric', 'min:0', 'max:240'],
            'actual_height_cm' => ['nullable', 'numeric', 'min:0', 'max:240'],
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
            'actual_weight_g.required' => 'Berat aktual (gram) wajib diisi.',
            'actual_weight_g.integer' => 'Berat aktual harus berupa bilangan bulat (gram).',
            'actual_weight_g.min' => 'Berat aktual harus lebih dari 0 gram.',
            'actual_weight_g.max' => 'Berat aktual terlalu besar.',
            'actual_length_cm.max' => 'Panjang aktual tidak boleh melebihi 240 cm.',
            'actual_width_cm.max' => 'Lebar aktual tidak boleh melebihi 240 cm.',
            'actual_height_cm.max' => 'Tinggi aktual tidak boleh melebihi 240 cm.',
        ];
    }
}
