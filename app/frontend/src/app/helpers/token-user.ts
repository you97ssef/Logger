export interface TokenUser {
    id: string;

    name: string;
    email: string;

    role: Role;

    created_at: string;
    updated_at: string;
    verified_at: string | null;

    expiration: number;
}

enum Role {
    Admin = 1,
    NormalUser = 2,
}
