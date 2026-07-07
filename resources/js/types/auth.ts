export type UserRole =
    'customer' | 'staff_surabaya' | 'staff_ende' | 'admin' | 'owner';

export type User = {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
};

export type Auth = {
    user: User;
    permissions: string[];
};

export const ROLE_LABELS: Record<UserRole, string> = {
    customer: 'Customer',
    staff_surabaya: 'Staff Surabaya',
    staff_ende: 'Staff Ende',
    admin: 'Admin',
    owner: 'Owner',
};
