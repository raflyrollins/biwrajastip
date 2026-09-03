export type User = {
    id: number;
    uuid: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    roles: string[];
    email_verified_at?: string | null;
    created_at: string;
    updated_at?: string;
    [key: string]: unknown; // This allows for additional properties...
};

export type Auth = {
    user: User | null;
    permissions: string[];
};
