export interface LoginDTO {
    email: string;
    password: string;
}

export interface RegisterDTO {
    name: string;
    email: string;
    password: string;
    confirm_password: string;
}

export interface ResetPasswordDTO {
    token: string;
    password: string;
    confirm_password: string;
}