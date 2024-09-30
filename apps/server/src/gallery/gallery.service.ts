import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Gallery, User } from '@repo/db';
import { GetGalleryDTO, ResponseDTO } from '@repo/dto';
import { Bucket } from 'src/interfaces';
import { PrismaService, SupabaseService } from 'src/lib';

interface IGallery extends Gallery {
  user: User;
}

@Injectable()
export class GalleryService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly supabaseService: SupabaseService,
  ) {}

  public async getAllGalleries(): Promise<
    ResponseDTO & {
      data?: GetGalleryDTO[];
    }
  > {
    const galleries: GetGalleryDTO[] = (
      await this.prismaService.gallery.findMany({
        include: { user: true },
        where: {
          deletedAt: { equals: null },
        },
      })
    ).map((gallery: IGallery): GetGalleryDTO => {
      return {
        id: gallery.id,
        image: gallery.image,
        user: {
          fullname: gallery.user.fullname,
          avatar: gallery.user.avatar,
        },
        createdAt: gallery.createdAt,
        updatedAt: gallery.updatedAt,
      };
    });
    if (galleries.length < 1)
      throw new NotFoundException('Galeri tidak ditemukan');
    return {
      message: 'Galeri berhasil diambil',
      statusCode: 200,
      data: galleries,
    };
  }
  public async createGallery(
    userId: number,
    files: Express.Multer.File[],
  ): Promise<ResponseDTO> {
    const uploadedUrls = await this.supabaseService.uploadFile(
      Bucket.GALLERY,
      files,
      userId.toString(),
    );
    if (!Array.isArray(uploadedUrls))
      throw new ConflictException('Unggahan gagal');
    await this.prismaService.gallery.createMany({
      data: uploadedUrls.map((file: { url: string }) => {
        return { image: file.url, userId };
      }),
    });
    return {
      message: 'Galeri berhasil dibuat',
      statusCode: 201,
    };
  }
  public async updateGallery(
    userId: number,
    galleryId: number,
    file: Express.Multer.File,
  ): Promise<ResponseDTO> {
    const gallery = await this.prismaService.gallery.findUnique({
      where: { id: galleryId, deletedAt: { equals: null } },
    });
    if (!gallery) throw new NotFoundException('Galeri tidak ditemukan');
    const uploadedUrl = await this.supabaseService.uploadFile(
      Bucket.GALLERY,
      file,
      userId.toString(),
    );
    if (Array.isArray(uploadedUrl))
      throw new ConflictException('Unggahan gagal');
    await this.prismaService.gallery.update({
      where: { id: galleryId },
      data: {
        image: uploadedUrl.url,
        updatedAt: new Date(),
        user: { connect: { userId } },
      },
    });

    return {
      message: 'Galeri berhasil diperbarui',
      statusCode: 200,
    };
  }
  public async deleteGallery(galleryId: number): Promise<ResponseDTO> {
    const gallery = await this.prismaService.gallery.findUnique({
      where: {
        id: galleryId,
        deletedAt: {
          equals: null,
        },
      },
    });
    if (!gallery) throw new NotFoundException('Galeri tidak ditemukan');
    await this.prismaService.gallery.update({
      where: { id: galleryId },
      data: { deletedAt: new Date() },
    });
    return {
      message: 'Galeri berhasil dihapus',
      statusCode: 200,
    };
  }
}
