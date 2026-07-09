import { createContext, useCallback, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type AlertFn = (message: string) => Promise<void>;
type ConfirmFn = (message: string) => Promise<boolean>;

interface AlertContextValue {
    alert: AlertFn;
    confirm: ConfirmFn;
}

const AlertContext = createContext<AlertContextValue | null>(null);

export function AlertProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<{
        message: string;
        type: 'alert' | 'confirm';
        resolve: (value: boolean) => void;
    } | null>(null);

    const alert: AlertFn = useCallback(
        (message) =>
            new Promise((resolve) => {
                setState({ message, type: 'alert', resolve: () => resolve() });
            }),
        [],
    );

    const confirm: ConfirmFn = useCallback(
        (message) =>
            new Promise((resolve) => {
                setState({ message, type: 'confirm', resolve });
            }),
        [],
    );

    const handleClose = useCallback(() => {
        setState(null);
    }, []);

    const handleConfirm = useCallback(
        (value: boolean) => {
            state?.resolve(value);
            setState(null);
        },
        [state],
    );

    return (
        <AlertContext.Provider value={{ alert, confirm }}>
            {children}

            {state && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
                    <div className="w-full max-w-sm border border-[var(--border-default)] bg-[var(--neutral-primary)] p-6 shadow-xl">
                        <p className="mb-6 text-sm leading-relaxed text-[var(--heading)]">
                            {state.message}
                        </p>
                        <div className="flex justify-end gap-3">
                            {state.type === 'confirm' && (
                                <button
                                    type="button"
                                    onClick={() => handleConfirm(false)}
                                    className="cursor-pointer border border-[var(--border-default)] bg-[var(--neutral-primary)] px-5 py-2.5 text-sm text-[var(--body)] transition-colors hover:bg-[var(--neutral-tertiary)]"
                                >
                                    Batal
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() =>
                                    state.type === 'confirm'
                                        ? handleConfirm(true)
                                        : handleClose()
                                }
                                className="cursor-pointer border-none bg-[var(--brand)] px-5 py-2.5 text-sm font-medium text-[var(--on-brand)] transition-colors hover:bg-[var(--brand-strong)]"
                            >
                                {state.type === 'confirm' ? 'Ya' : 'OK'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AlertContext.Provider>
    );
}

export function useAlert() {
    const ctx = useContext(AlertContext);

    if (!ctx) {
        throw new Error('useAlert must be used within AlertProvider');
    }

    return ctx.alert;
}

export function useConfirm() {
    const ctx = useContext(AlertContext);

    if (!ctx) {
        throw new Error('useConfirm must be used within AlertProvider');
    }

    return ctx.confirm;
}
