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
    type TransactionPostType = {
        profile_id: number;
        amount: number;
        type: string;
        category_id: number;
    }
    type CategoryType = {
        id: number;
        name: string;
    }
    type TransactionType = {
        id: number;
        profile: ProfileType;
        amount: number;
        type: string;
        category: CategoryType;
        created_at: Date;
    }
    export type { UserType, ProfileType, TransactionType, TransactionPostType, CategoryType };