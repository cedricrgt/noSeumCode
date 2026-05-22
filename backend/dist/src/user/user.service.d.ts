import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UserService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateUserDto): Promise<{
        userName: string;
        firstName: string;
        lastName: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        id: string;
        created_at: Date;
    }>;
    findAll(): Promise<{
        userName: string;
        firstName: string;
        lastName: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        id: string;
        created_at: Date;
        is_blocked: boolean;
    }[]>;
    findOne(id: string): Promise<{
        userName: string;
        firstName: string;
        lastName: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        id: string;
        created_at: Date;
        is_blocked: boolean;
    }>;
    update(id: string, dto: UpdateUserDto, requesterId: string): Promise<{
        userName: string;
        firstName: string;
        lastName: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        id: string;
        password_hash: string;
        created_at: Date;
        updated_at: Date;
        is_deleted: boolean;
        deleted_at: Date | null;
        is_blocked: boolean;
        blocked_at: Date | null;
        blockedById: string | null;
        deletedById: string | null;
        updatedById: string | null;
    }>;
    remove(id: string, requesterId: string): Promise<{
        userName: string;
        firstName: string;
        lastName: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        id: string;
        password_hash: string;
        created_at: Date;
        updated_at: Date;
        is_deleted: boolean;
        deleted_at: Date | null;
        is_blocked: boolean;
        blocked_at: Date | null;
        blockedById: string | null;
        deletedById: string | null;
        updatedById: string | null;
    }>;
}
