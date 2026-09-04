import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useViewportPosition } from '@/hooks/useViewportPosition';

const DAYS = ['Sn', 'Sl', 'Rb', 'Km', 'Jm', 'Sb', 'Mg'];
const MONTHS = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
];

function parseValue(value: string): { date: string; time: string } {
    if (!value) return { date: '', time: '' };
    const [date, time] = value.split('T');
    return {
        date: date ?? '',
        time: time ?? '00:00',
    };
}

function toDateString(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

function daysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
}

function firstDayOfWeek(year: number, month: number): number {
    return (new Date(year, month, 1).getDay() + 6) % 7;
}

type DateTimePickerProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
};

export function DateTimePicker({
    label,
    value,
    onChange,
    placeholder = 'Pilih tanggal & waktu',
}: DateTimePickerProps) {
    const { date: selectedDate, time: selectedTime } = parseValue(value);

    const now = new Date();
    const initial = selectedDate ? new Date(selectedDate + 'T00:00:00') : now;

    const [viewYear, setViewYear] = useState(initial.getFullYear());
    const [viewMonth, setViewMonth] = useState(initial.getMonth());

    const { triggerRef, dropdownRef, open, toggle, position } =
        useViewportPosition(4);

    const calendarDays = useMemo(() => {
        const total = daysInMonth(viewYear, viewMonth);
        const start = firstDayOfWeek(viewYear, viewMonth);
        const cells: (number | null)[] = [];
        for (let i = 0; i < start; i++) cells.push(null);
        for (let d = 1; d <= total; d++) cells.push(d);
        return cells;
    }, [viewYear, viewMonth]);

    const todayStr = toDateString(now);

    const pickDate = (day: number) => {
        const ds = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const time = selectedTime || '00:00';
        onChange(`${ds}T${time}`);
        toggle();
    };

    const prevMonth = () => {
        if (viewMonth === 0) {
            setViewMonth(11);
            setViewYear((y) => y - 1);
        } else {
            setViewMonth((m) => m - 1);
        }
    };

    const nextMonth = () => {
        if (viewMonth === 11) {
            setViewMonth(0);
            setViewYear((y) => y + 1);
        } else {
            setViewMonth((m) => m + 1);
        }
    };

    const displayText = selectedDate
        ? (() => {
              const d = new Date(selectedDate + 'T00:00:00');
              const formatted = d.toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
              });
              return selectedTime ? `${formatted} ${selectedTime}` : formatted;
          })()
        : '';

    return (
        <div
            className="relative grid gap-1.5"
            ref={triggerRef as React.Ref<HTMLDivElement>}
        >
            <label className="text-heading text-sm font-medium">{label}</label>

            <button
                type="button"
                onClick={toggle}
                className={cn(
                    'bg-neutral-secondary-medium text-heading placeholder:text-body flex w-full items-center border px-3 py-2.5 text-sm',
                    'border-border-default-medium focus:border-brand focus:ring-brand focus:ring-1 focus:outline-none',
                )}
            >
                <Calendar className="text-body-subtle mr-2 h-4 w-4 shrink-0" />
                <span className={selectedDate ? '' : 'text-body'}>
                    {displayText || placeholder}
                </span>
            </button>

            {open && position && (
                <div
                    ref={dropdownRef as React.Ref<HTMLDivElement>}
                    style={position}
                    className="border-border-default bg-neutral-primary w-72 border shadow-lg"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b px-3 py-2">
                        <button
                            type="button"
                            onClick={prevMonth}
                            className="text-body hover:text-heading p-1"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <span className="text-heading text-sm font-semibold">
                            {MONTHS[viewMonth]} {viewYear}
                        </span>
                        <button
                            type="button"
                            onClick={nextMonth}
                            className="text-body hover:text-heading p-1"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Day names */}
                    <div className="grid grid-cols-7 gap-px px-2 pt-2">
                        {DAYS.map((d) => (
                            <div
                                key={d}
                                className="text-body-subtle py-1 text-center text-xs font-medium"
                            >
                                {d}
                            </div>
                        ))}
                    </div>

                    {/* Day grid */}
                    <div className="grid grid-cols-7 gap-px px-2 pb-1">
                        {calendarDays.map((day, i) => {
                            if (day === null) {
                                return <div key={`empty-${i}`} />;
                            }
                            const ds = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                            const isSelected = ds === selectedDate;
                            const isToday = ds === todayStr;

                            return (
                                <button
                                    key={ds}
                                    type="button"
                                    onClick={() => pickDate(day)}
                                    className={cn(
                                        'flex h-8 items-center justify-center text-sm',
                                        isSelected
                                            ? 'bg-fg-brand font-semibold text-white'
                                            : isToday
                                              ? 'text-fg-brand font-semibold'
                                              : 'text-heading hover:bg-neutral-secondary-soft',
                                    )}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>

                    {/* Time input */}
                    <div className="border-t px-3 py-2">
                        <label className="text-body-subtle mb-1 block text-xs">
                            Waktu
                        </label>
                        <input
                            type="time"
                            value={selectedTime || '00:00'}
                            onChange={(e) => {
                                const time = e.target.value;
                                if (selectedDate) {
                                    onChange(`${selectedDate}T${time}`);
                                } else {
                                    const ds = toDateString(now);
                                    onChange(`${ds}T${time}`);
                                }
                            }}
                            className="bg-neutral-secondary-medium text-heading border-border-default-medium focus:border-brand focus:ring-brand w-full border px-2 py-1.5 text-sm focus:ring-1 focus:outline-none"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
