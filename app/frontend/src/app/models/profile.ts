export interface Profile {
    ID: string;
    CreatedAt: string;
    UpdatedAt: string;

    UserId: string;
    
    Name: string;
    Token: string;
    Trackers: string | null;
}
