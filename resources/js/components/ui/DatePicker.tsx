import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

interface DatePickerProps {
    value?: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

const MONTHS = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

const DAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export default function DatePicker({
    value,
    onChange,
    placeholder = 'Pilih tanggal...',
    className,
    disabled,
}: DatePickerProps) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedDate = value ? new Date(value + 'T00:00:00') : null;
    const [viewMonth, setViewMonth] = useState(
        selectedDate?.getMonth() ?? new Date().getMonth(),
    );
    const [viewYear, setViewYear] = useState(
        selectedDate?.getFullYear() ?? new Date().getFullYear(),
    );

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);

        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();

    const days: (number | null)[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
        days.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
        days.push(d);
    }

    function isToday(day: number) {
        const today = new Date();

        return (
            today.getDate() === day &&
            today.getMonth() === viewMonth &&
            today.getFullYear() === viewYear
        );
    }

    function isSelected(day: number) {
        return (
            selectedDate?.getDate() === day &&
            selectedDate?.getMonth() === viewMonth &&
            selectedDate?.getFullYear() === viewYear
        );
    }

    function handleSelect(day: number) {
        const month = String(viewMonth + 1).padStart(2, '0');
        const d = String(day).padStart(2, '0');
        onChange(`${viewYear}-${month}-${d}`);
        setOpen(false);
    }

    function prevMonth() {
        if (viewMonth === 0) {
            setViewMonth(11);
            setViewYear((y) => y - 1);
        } else {
            setViewMonth((m) => m - 1);
        }
    }

    function nextMonth() {
        if (viewMonth === 11) {
            setViewMonth(0);
            setViewYear((y) => y + 1);
        } else {
            setViewMonth((m) => m + 1);
        }
    }

    const displayValue = selectedDate
        ? `${selectedDate.getDate()} ${MONTHS[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`
        : '';

    return (
        <div ref={containerRef} className={cn('relative', className)}>
            <button
                type="button"
                onClick={() => {
                    if (!disabled) setOpen(!open);
                }}
                disabled={disabled}
                className={cn(
                    'flex w-full cursor-pointer items-center border border-[var(--border-default)] bg-[var(--neutral-primary)] px-3 py-2.5 text-left text-sm transition-colors hover:border-[var(--brand)]',
                    disabled && 'cursor-not-allowed opacity-50',
                    open && 'border-[var(--brand)]',
                    !displayValue && 'text-[var(--body-subtle)]',
                )}
            >
                <CalendarDays
                    size={16}
                    className="mr-2 shrink-0 text-[var(--body-subtle)]"
                />
                <span className="flex-1 truncate">
                    {displayValue || placeholder}
                </span>
            </button>

            {open && (
                <div className="absolute left-0 z-50 mt-1 w-72 border border-[var(--border-default)] bg-[var(--neutral-primary)] p-4 shadow-lg">
                    {/* ── Month/Year header ── */}
                    <div className="mb-4 flex items-center justify-between gap-1">
                        <button
                            type="button"
                            onClick={prevMonth}
                            className="flex size-8 shrink-0 cursor-pointer items-center justify-center border border-[var(--border-default)] bg-transparent text-[var(--body)] hover:text-[var(--heading)]"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <span className="text-sm font-medium text-[var(--heading)]">
                            {MONTHS[viewMonth]}
                        </span>
                        <div className="relative">
                            <select
                                value={viewYear}
                                onChange={(e) => setViewYear(Number(e.target.value))}
                                className="appearance-none cursor-pointer border border-[var(--border-default)] bg-[var(--neutral-primary)] px-2 py-1 text-sm text-[var(--heading)] outline-none focus:border-[var(--brand)]"
                            >
                                {Array.from({ length: 11 }, (_, i) => new Date().getFullYear() + 1 - i).map((y) => (
                                    <option key={y} value={y}>
                                        {y}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="button"
                            onClick={nextMonth}
                            className="flex size-8 shrink-0 cursor-pointer items-center justify-center border border-[var(--border-default)] bg-transparent text-[var(--body)] hover:text-[var(--heading)]"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>

                    {/* ── Day names ── */}
                    <div className="mb-2 grid grid-cols-7 text-center text-xs font-medium text-[var(--body-subtle)]">
                        {DAYS.map((d) => (
                            <div key={d} className="py-1">
                                {d}
                            </div>
                        ))}
                    </div>

                    {/* ── Days ── */}
                    <div className="grid grid-cols-7 text-center text-sm">
                        {days.map((day, i) =>
                            day ? (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => handleSelect(day)}
                                    className={cn(
                                        'flex cursor-pointer items-center justify-center rounded-none py-1.5 text-sm transition-colors hover:bg-[var(--neutral-tertiary)]',
                                        isSelected(day) &&
                                            'bg-[var(--brand)] font-medium text-[var(--on-brand)] hover:bg-[var(--brand-strong)]',
                                        isToday(day) &&
                                            !isSelected(day) &&
                                            'border border-[var(--brand)]',
                                    )}
                                >
                                    {day}
                                </button>
                            ) : (
                                <div key={i} />
                            ),
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
