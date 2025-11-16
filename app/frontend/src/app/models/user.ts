export interface User {
    ID: string;

    CreatedAt: string;
    UpdatedAt: string;

    Name: string;
    Role: number;

    Email: string;
    Password: string;

    VerifiedAt: string | null;
}
