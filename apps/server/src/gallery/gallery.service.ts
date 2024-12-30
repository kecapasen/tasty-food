import { TZDate } from '@date-fns/tz';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Gallery, Prisma, Type, User } from '@repo/db';
import { CreateGalleryDTO, GetGalleryDTO, ResponseDTO } from '@repo/dto';
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
        type: gallery.type,
        user: {
          fullname: gallery.user.fullname,
          avatar: gallery.user.avatar,
        },
        createdAt: new TZDate(new Date(gallery.createdAt), 'Asia/Jakarta'),
        updatedAt: gallery.updatedAt
          ? new TZDate(new Date(gallery.updatedAt), 'Asia/Jakarta')
          : gallery.updatedAt,
      };
    });
    return {
      message: 'Galeri berhasil diambil',
      statusCode: 200,
      data: galleries,
    };
  }
  public async createGallery(
    userId: number,
    files: Express.Multer.File[],
    createGalleryDTO: CreateGalleryDTO,
  ): Promise<ResponseDTO> {
    const uploadedUrls = await this.supabaseService.uploadFile(
      Bucket.GALLERY,
      files,
      userId.toString(),
    );
    if (!Array.isArray(uploadedUrls))
      throw new ConflictException('Unggahan gagal');
    const createdAt = new TZDate(new Date(), 'Asia/Jakarta');
    await this.prismaService.gallery.createMany({
      data: uploadedUrls.map(
        (file: { url: string }): Prisma.GalleryCreateManyInput => {
          return {
            userId,
            image: file.url,
            type: createGalleryDTO.type,
            createdAt,
          };
        },
      ),
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
      where: { id: galleryId, type: Type.SLIDER, deletedAt: { equals: null } },
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
        updatedAt: new TZDate(new Date(), 'Asia/Jakarta'),
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
      data: { deletedAt: new TZDate(new Date(), 'Asia/Jakarta') },
    });
    return {
      message: 'Galeri berhasil dihapus',
      statusCode: 200,
    };
  }
}
