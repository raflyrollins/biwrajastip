export type User = {
    id: number;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    roles: { id: number; name: string; label: string }[];
};

export type Auth = {
    user: User | null;
    permissions: string[];
};
