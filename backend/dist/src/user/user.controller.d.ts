import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(createUserDto: CreateUserDto): Promise<{
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
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
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
    remove(id: string): Promise<{
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
