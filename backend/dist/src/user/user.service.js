"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
let UserService = class UserService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        console.log('UserService.create called, DATABASE_URL=', process.env.DATABASE_URL);
        const exists = await this.prisma.user.findFirst({
            where: {
                OR: [{ email: dto.email }, { userName: dto.userName }]
            }
        });
        if (exists)
            throw new common_1.ConflictException('Email ou userName déjà utilisé');
        const password_hash = await bcrypt.hash(dto.password, 10);
        const created = await this.prisma.user.create({
            data: {
                userName: dto.userName,
                firstName: dto.firstName,
                lastName: dto.lastName,
                email: dto.email,
                password_hash,
                role: dto.role ?? 'USER',
            },
            select: {
                id: true,
                userName: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                created_at: true,
            }
        });
        console.log('UserService.create created:', created);
        return created;
    }
    async findAll() {
        return this.prisma.user.findMany({
            where: {
                is_deleted: false
            },
            select: {
                id: true,
                userName: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                is_blocked: true,
                created_at: true,
            }
        });
    }
    async findOne(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                userName: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                is_blocked: true,
                created_at: true,
            }
        });
        if (!user)
            throw new common_1.NotFoundException(`Utilisateur ${id} ou mot de passe incorrect`);
        return user;
    }
    async update(id, dto, requesterId) {
        await this.findOne(id);
        return this.prisma.user.update({
            where: { id },
            data: {
                ...dto,
                updatedById: requesterId,
            }
        });
    }
    async remove(id, requesterId) {
        await this.findOne(id);
        return this.prisma.user.update({
            where: { id },
            data: {
                is_deleted: true,
                deleted_at: new Date(),
                deletedById: requesterId,
            }
        });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);
//# sourceMappingURL=user.service.js.map