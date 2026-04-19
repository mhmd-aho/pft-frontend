import { z } from "zod";



type UserType = {
    username: string;
    email: string;
}

type ProfileType = {
    id: number;
    user: UserType;
    balance: number;
}

type CategoryType = {
    id: number;
    name: string;
}

type TransactionType = {
    id: number;
    profile: ProfileType;
    amount: number;
    type: 'income' | 'expense';
    category: CategoryType;
    created_at: string;
}

type TransactionPostType = {
    profile_id: number;
    amount: number;
    type: 'income' | 'expense';
    category_id: number;
}
type BudgetType = {
    id: number;
    profile: ProfileType;
    amount: number;
    category: CategoryType;
}


const transactionSchema = z.object({
    amount: z.coerce.number().gt(0, 'Amount must be greater than 0'),
    type: z.enum(['income', 'expense']),
    category_id: z.coerce.number().gt(0, 'Category is required'),
});

const signinSchema = z.object({
    username: z.string().min(3, 'username is too short'),
    password: z.string().min(8, "password is too short"),
});

const registerSchema = z.object({
    username: z.string().min(3, 'username is too short'),
    email: z.string().email(),
    password: z.string().min(8, "password is too short"),
    re_password: z.string()
}).refine((data) => data.password === data.re_password, {
    message: "Password don't match",
    path: ["re_password"]
});
const budgetSchema = z.object({
    amount: z.coerce.number().gt(0, 'Amount must be greater than 0'),
    category_id: z.coerce.number().gt(0, 'Category is required'),
});
export { transactionSchema, signinSchema, registerSchema, budgetSchema };
export type { UserType, ProfileType, CategoryType, TransactionType, TransactionPostType,BudgetType };
