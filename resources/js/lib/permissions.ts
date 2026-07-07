import { usePage } from '@inertiajs/react';

import type { Auth, UserRole } from '@/types';

export function useAuth() {
    const { auth } = usePage().props as { auth: Auth };

    return auth;
}

export function useRole(): UserRole {
    return useAuth().user.role;
}

export function usePermissions(): string[] {
    return useAuth().permissions;
}

export function useHasRole(role: UserRole): boolean {
    return useRole() === role;
}

export function useHasAnyRole(roles: UserRole[]): boolean {
    return roles.includes(useRole());
}

export function useCan(permission: string): boolean {
    return usePermissions().includes(permission);
}

export function useCanAny(permissions: string[]): boolean {
    const perms = usePermissions();

    return permissions.some((p) => perms.includes(p));
}
