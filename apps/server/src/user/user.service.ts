import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService, SupabaseService } from 'src/lib';
import { Bucket } from 'src/interfaces';
import {
  CreateUserDTO,
  GetUserDTO,
  ResponseDTO,
  UpdateUserDTO,
} from '@repo/dto';
import { Prisma, Role, User } from '@repo/db';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly supabaseService: SupabaseService,
  ) {}

  public async getAllUsers(userId: number): Promise<
    ResponseDTO & {
      data?: GetUserDTO[];
    }
  > {
    const users = await this.prismaService.user.findMany({
      where: {
        NOT: { userId },
        deletedAt: null,
      },
      orderBy: [
        {
          role: 'asc',
        },
      ],
    });
    const userResponses: GetUserDTO[] = users.map(
      (user: User): GetUserDTO => ({
        userId: user.userId,
        fullname: user.fullname,
        password: user.password,
        role: user.role,
        avatar: user.avatar,
      }),
    );
    if (userResponses.length < 1)
      throw new NotFoundException('Tidak ada Karyawan ditemukan');
    return {
      message: 'Karyawan berhasil diambil',
      statusCode: 200,
      data: userResponses,
    };
  }
  public async getUserById(
    employeeId: number,
  ): Promise<ResponseDTO & { data?: GetUserDTO }> {
    const user = await this.prismaService.user.findUnique({
      where: { userId: employeeId, deletedAt: null },
    });
    if (!user) throw new NotFoundException('Karyawan tidak ditemukan');
    const responseData: GetUserDTO = {
      userId: user.userId,
      fullname: user.fullname,
      password: user.password,
      role: user.role,
      avatar: user.avatar,
    };
    return {
      message: 'Karyawan berhasil diambil',
      statusCode: 200,
      data: responseData,
    };
  }
  public async createUser(
    createUserDTO: CreateUserDTO,
    file?: Express.Multer.File,
  ): Promise<ResponseDTO> {
    const existingUser = await this.prismaService.user.findUnique({
      where: { userId: createUserDTO.userId },
    });
    if (existingUser) throw new ConflictException('Karyawan sudah ada');
    const userData: Prisma.UserCreateInput = {
      userId: createUserDTO.userId,
      fullname: createUserDTO.fullname,
      role: createUserDTO.role,
      password: createUserDTO.password,
    };
    if (file) {
      const avatarUrl = await this.supabaseService.uploadFile(
        Bucket.AVATAR,
        file,
        createUserDTO.userId.toString(),
      );
      if (Array.isArray(avatarUrl))
        throw new ConflictException('Kesalahan saat mengunggah avatar');
      userData.avatar = avatarUrl.url;
    }
    await this.prismaService.user.create({ data: userData });
    if (createUserDTO.role === Role.WAITER) {
      await this.prismaService.cart.create({
        data: { userId: createUserDTO.userId },
      });
    }
    return { message: 'Karyawan berhasil dibuat', statusCode: 201 };
  }
  public async updateUser(
    employeeId: number,
    updateUserDTO: UpdateUserDTO,
    file?: Express.Multer.File,
  ): Promise<ResponseDTO> {
    const user = await this.prismaService.user.findUnique({
      where: { userId: employeeId, deletedAt: null },
    });
    if (!user) throw new NotFoundException('Karyawan tidak ditemukan');
    const updatedData: Prisma.UserUpdateInput = {
      fullname: updateUserDTO.fullname,
      role: updateUserDTO.role,
      password: updateUserDTO.password,
      updatedAt: new Date(),
    };
    if (file) {
      const avatarUrl = await this.supabaseService.uploadFile(
        Bucket.AVATAR,
        file,
        employeeId.toString(),
      );
      if (Array.isArray(avatarUrl))
        throw new ConflictException('Kesalahan saat mengunggah avatar');
      updatedData.avatar = avatarUrl.url;
    }
    await this.prismaService.user.update({
      where: { userId: employeeId },
      data: updatedData,
    });
    return {
      message: 'Karyawan berhasil diperbarui',
      statusCode: 200,
    };
  }
  public async deleteUser(employeeId: number): Promise<ResponseDTO> {
    const user = await this.prismaService.user.findUnique({
      where: { userId: employeeId, deletedAt: null },
    });
    if (!user) throw new NotFoundException('Karyawan tidak ditemukan');
    await this.prismaService.user.update({
      where: { userId: employeeId },
      data: { deletedAt: new Date() },
    });
    return {
      message: 'Karyawan berhasil dihapus',
      statusCode: 200,
    };
  }
}
