export interface NewProfileDTO {
    name: string;
}

export interface UpdateProfileDTO {
    name: string | null;
    trackers: Tracker[] | null;
}

export interface Tracker {
    name: string;
    pattern: string;
    platform: string;
}
