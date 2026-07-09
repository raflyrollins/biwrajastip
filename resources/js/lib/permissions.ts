import { usePage } from '@inertiajs/react';

import type { Auth } from '@/types';

export function useAuth() {
    const { auth } = usePage().props as { auth: Auth };

    return auth;
}

export function usePermissions(): string[] {
    return useAuth().permissions;
}

export function useCan(permission: string): boolean {
    return usePermissions().includes(permission);
}

export function useCanAny(permissions: string[]): boolean {
    const perms = usePermissions();

    return permissions.some((p) => perms.includes(p));
}

export function useUserRoles() {
    return useAuth().user?.roles ?? [];
}

export function useHasRole(roleName: string): boolean {
    return useUserRoles().some((r) => r.name === roleName);
}
