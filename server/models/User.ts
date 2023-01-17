export interface IUser {
    id: number;
    name: string;
    username: string;
    address: string;
    email: string;
    password: Buffer;
    betAccountId: number;
    salt: string;
} 