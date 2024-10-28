import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService, SupabaseService } from 'src/lib';
import { Bucket } from 'src/interfaces';
import {
  CreateMenuDTO,
  GetMenuDTO,
  ResponseDTO,
  UpdateMenuDTO,
} from '@repo/dto';
import { Menu, Prisma } from '@repo/db';

@Injectable()
export class MenuService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly supabaseService: SupabaseService,
  ) {}

  public async getAllMenus(): Promise<
    ResponseDTO & {
      data?: GetMenuDTO[];
    }
  > {
    const menus: GetMenuDTO[] = (
      await this.prismaService.menu.findMany({
        where: {
          deletedAt: { equals: null },
        },
        orderBy: [
          {
            id: 'desc',
          },
        ],
      })
    ).map((menu: Menu): GetMenuDTO => {
      return {
        id: menu.id,
        name: menu.name,
        description: menu.description,
        price: menu.price,
        category: menu.category,
        image: menu.image,
        createdAt: menu.createdAt,
        updatedAt: menu.updatedAt,
      };
    });
    if (menus.length < 1) throw new NotFoundException('Menu tidak ditemukan');
    return {
      message: 'Menu berhasil diambil',
      statusCode: 200,
      data: menus,
    };
  }
  public async getMenuById(menuId: number): Promise<
    ResponseDTO & {
      data?: GetMenuDTO;
    }
  > {
    const menu = await this.prismaService.menu.findUnique({
      include: { user: true },
      where: {
        id: menuId,
        deletedAt: {
          equals: null,
        },
      },
    });
    if (!menu) throw new NotFoundException('Menu tidak ditemukan');
    const responseData: GetMenuDTO = {
      id: menu.id,
      name: menu.name,
      description: menu.description,
      price: menu.price,
      category: menu.category,
      image: menu.image,
      user: {
        fullname: menu.user.fullname,
        avatar: menu.user.avatar,
      },
      createdAt: menu.createdAt,
      updatedAt: menu.updatedAt,
    };
    return {
      message: 'Menu berhasil diambil',
      statusCode: 200,
      data: responseData,
    };
  }
  public async createMenu(
    userId: number,
    createMenuDTO: CreateMenuDTO,
    file: Express.Multer.File,
  ): Promise<ResponseDTO> {
    const menuExists = await this.prismaService.menu.findUnique({
      where: {
        name: createMenuDTO.name,
      },
    });
    if (menuExists) throw new ConflictException('Menu sudah ada');
    const imageUrl = await this.supabaseService.uploadFile(
      Bucket.MENU,
      file,
      userId.toString(),
    );
    if (Array.isArray(imageUrl))
      throw new ConflictException('Unggahan gambar gagal');
    await this.prismaService.menu.create({
      data: {
        ...createMenuDTO,
        image: imageUrl.url,
        user: { connect: { userId } },
      },
    });
    return { message: 'Menu berhasil dibuat', statusCode: 201 };
  }
  public async updateMenu(
    userId: number,
    menuId: number,
    updateMenuDTO: UpdateMenuDTO,
    file?: Express.Multer.File,
  ): Promise<ResponseDTO> {
    const menuExists = await this.prismaService.menu.findUnique({
      where: { id: menuId, deletedAt: { equals: null } },
    });
    if (!menuExists) throw new NotFoundException('Menu tidak ditemukan');
    const updateData: Prisma.MenuUpdateInput = {
      name: updateMenuDTO.name,
      description: updateMenuDTO.description,
      price: updateMenuDTO.price,
      category: updateMenuDTO.category,
      updatedAt: new Date(),
      user: { connect: { userId } },
    };
    if (file) {
      const imageUrl = await this.supabaseService.uploadFile(
        Bucket.MENU,
        file,
        userId.toString(),
      );
      if (Array.isArray(imageUrl))
        throw new ConflictException('Unggahan gambar gagal');
      updateData['image'] = imageUrl.url;
    }
    await this.prismaService.menu.update({
      where: { id: menuId },
      data: updateData,
    });
    return {
      message: 'Menu berhasil diperbarui',
      statusCode: 200,
    };
  }
  public async deleteMenu(menuId: number): Promise<ResponseDTO> {
    const menuExists = await this.prismaService.menu.findUnique({
      where: {
        id: menuId,
        deletedAt: { equals: null },
      },
    });
    if (!menuExists) throw new NotFoundException('Menu tidak ditemukan');
    await this.prismaService.menu.update({
      where: { id: menuId },
      data: { deletedAt: new Date() },
    });
    return {
      message: 'Menu berhasil dihapus',
      statusCode: 200,
    };
  }
}
