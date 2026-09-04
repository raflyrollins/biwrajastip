import { useCallback, useEffect, useRef, useState } from 'react';

const DROPDOWN_HEIGHT_ESTIMATE = 300;

type PositionStyle = {
    position: 'fixed';
    top: number;
    left: number;
    width: number;
    zIndex: number;
};

/**
 * Compute `position: fixed` coordinates for a dropdown/popover relative to
 * the trigger element's viewport position.  Opens downward when there is
 * enough room below the trigger; otherwise opens upward.  Recalculates on
 * scroll and resize while open.
 */
export function useViewportPosition(dropUpOffset = 4) {
    const triggerRef = useRef<HTMLElement>(null);
    const dropdownRef = useRef<HTMLElement>(null);
    const [open, setOpen] = useState(false);
    const [position, setPosition] = useState<PositionStyle | null>(null);

    const calculatePosition = useCallback(() => {
        const trigger = triggerRef.current;
        if (!trigger) return;
        const rect = trigger.getBoundingClientRect();
        const viewportH = window.innerHeight;
        const spaceBelow = viewportH - rect.bottom;
        const openUp = spaceBelow < DROPDOWN_HEIGHT_ESTIMATE;
        const top = openUp
            ? rect.top - DROPDOWN_HEIGHT_ESTIMATE - dropUpOffset
            : rect.bottom + dropUpOffset;
        setPosition({
            position: 'fixed',
            top: Math.max(0, top),
            left: rect.left,
            width: rect.width,
            zIndex: 50,
        });
    }, [dropUpOffset]);

    useEffect(() => {
        if (!open) return;
        calculatePosition();
        const onScroll = () => calculatePosition();
        const onResize = () => calculatePosition();
        window.addEventListener('scroll', onScroll, true);
        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('scroll', onScroll, true);
            window.removeEventListener('resize', onResize);
        };
    }, [open, calculatePosition]);

    useEffect(() => {
        if (!open) return;
        function onOutside(e: MouseEvent) {
            if (
                triggerRef.current &&
                !triggerRef.current.contains(e.target as Node) &&
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        }
        function onKey(e: KeyboardEvent) {
            if (e.key === 'Escape') setOpen(false);
        }
        document.addEventListener('mousedown', onOutside);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onOutside);
            document.removeEventListener('keydown', onKey);
        };
    }, [open]);

    const toggle = useCallback(() => {
        setOpen((prev) => !prev);
    }, []);

    return {
        triggerRef,
        dropdownRef,
        open,
        setOpen,
        toggle,
        position,
    };
}
