import { MultiSelect, type SelectOption } from '@/components/MultiSelect';

type StatusFilterProps = {
    value: string[];
    onChange: (value: string[]) => void;
    options: Record<string, string>;
    placeholder?: string;
};

export function StatusFilter({
    value,
    onChange,
    options,
    placeholder = 'Semua Status',
}: StatusFilterProps) {
    const selectOptions: SelectOption[] = Object.entries(options).map(
        ([val, label]) => ({ value: val, label }),
    );

    return (
        <MultiSelect
            label="Status"
            value={value}
            onChange={onChange}
            options={selectOptions}
            placeholder={placeholder}
        />
    );
}
