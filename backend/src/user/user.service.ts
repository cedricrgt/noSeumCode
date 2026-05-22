import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

  // On injecte PrismaService pour accéder à la base
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    console.log('UserService.create called, DATABASE_URL=', process.env.DATABASE_URL);
    // Vérifier que l'email et le userName ne sont pas déjà pris
    const exists = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }, { userName: dto.userName }]
      }
    });
    if (exists) throw new ConflictException('Email ou userName déjà utilisé');

    // Hasher le mot de passe avant de le stocker
    const password_hash = await bcrypt.hash(dto.password, 10);

    // data = uniquement les colonnes à insérer en base
    const created = await this.prisma.user.create({
      data: {
        userName:      dto.userName,
        firstName:     dto.firstName,
        lastName:      dto.lastName,
        email:         dto.email,
        password_hash,
        role:          dto.role ?? 'USER',
      },
      select: {
        id:         true,
        userName:   true,
        firstName:  true,
        lastName:   true,
        email:      true,
        role:       true,
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
        id:         true,
        userName:   true,
        firstName:  true,
        lastName:   true,
        email:      true,
        role:       true,
        is_blocked: true,
        created_at: true,
      }
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id:         true,
        userName:   true,
        firstName:  true,
        lastName:   true,
        email:      true,
        role:       true,
        is_blocked: true,
        created_at: true,
      }
    });

    if (!user) throw new NotFoundException(`Utilisateur ${id} ou mot de passe incorrect`);
    return user;
  }

  async update(id: string, dto: UpdateUserDto, requesterId: string) {
    await this.findOne(id); // vérifie que le user existe

    return this.prisma.user.update({
      where: { id },
      data: {
        ...dto,              
        updatedById: requesterId, // ← trace qui a fait la modif
        // updated_at → mis à jour automatiquement par @updatedAt
      }
    });
  }

  async remove(id: string, requesterId: string) {
    await this.findOne(id); // vérifie que le user existe

    // Soft delete — on ne supprime jamais physiquement
    return this.prisma.user.update({
      where: { id },
      data: {
        is_deleted:  true,
        deleted_at:  new Date(),
        deletedById: requesterId, // ← on trace qui a supprimé
      }
    });
  }
}