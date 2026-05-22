import { Role } from '@prisma/client';
export declare class CreateUserDto {
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: Role;
}
