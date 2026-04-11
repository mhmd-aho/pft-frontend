    type UserType = {
        username: string;
        email: string;
    }

    type ProfileType = {
        id: number;
        user: UserType;
        user_id?: number;
        balance: number;
    }
    export type { UserType, ProfileType };