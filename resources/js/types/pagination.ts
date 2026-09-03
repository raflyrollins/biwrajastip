export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type PaginationMeta = {
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
    links: PaginationLink[];
};
