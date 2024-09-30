import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { News, Prisma, User } from '@repo/db';
import {
  CreateNewsDTO,
  GetNewsDTO,
  ResponseDTO,
  UpdateNewsDTO,
} from '@repo/dto';
import { Bucket } from 'src/interfaces';
import { PrismaService, SupabaseService } from 'src/lib';

interface INews extends News {
  user: User;
}

@Injectable()
export class NewsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly supabaseService: SupabaseService,
  ) {}

  public async getAllNews(): Promise<
    ResponseDTO & {
      data?: GetNewsDTO[];
    }
  > {
    const newsList: GetNewsDTO[] = (
      await this.prismaService.news.findMany({
        include: { user: true },
        where: {
          deletedAt: { equals: null },
        },
      })
    ).map((news: INews): GetNewsDTO => {
      return {
        id: news.id,
        title: news.title,
        article: news.article,
        headerImage: news.headerImage,
        user: {
          fullname: news.user.fullname,
          avatar: news.user.avatar,
        },
        createdAt: news.createdAt,
        updatedAt: news.updatedAt,
      };
    });
    if (newsList.length < 1)
      throw new NotFoundException('Tidak ada berita ditemukan');
    return {
      message: 'Berita berhasil diambil',
      statusCode: 200,
      data: newsList,
    };
  }
  public async getNewsById(newsId: number): Promise<
    ResponseDTO & {
      data?: GetNewsDTO;
    }
  > {
    const newsItem = await this.prismaService.news.findUnique({
      include: { user: true },
      where: {
        id: newsId,
        deletedAt: {
          equals: null,
        },
      },
    });
    if (!newsItem) throw new NotFoundException('Berita tidak ditemukan');
    const responseData: GetNewsDTO = {
      id: newsItem.id,
      title: newsItem.title,
      article: newsItem.article,
      headerImage: newsItem.headerImage,
      user: {
        fullname: newsItem.user.fullname,
        avatar: newsItem.user.avatar,
      },
      createdAt: newsItem.createdAt,
      updatedAt: newsItem.updatedAt,
    };
    return {
      message: 'Berita berhasil diambil',
      statusCode: 200,
      data: responseData,
    };
  }
  public async createNews(
    userId: number,
    createNewsDTO: CreateNewsDTO,
    file: Express.Multer.File,
  ): Promise<ResponseDTO> {
    const imageUrl = await this.supabaseService.uploadFile(
      Bucket.NEWS,
      file,
      userId.toString(),
    );
    if (Array.isArray(imageUrl))
      throw new ConflictException('Unggahan gambar gagal');
    await this.prismaService.news.create({
      data: {
        ...createNewsDTO,
        userId,
        headerImage: imageUrl.url,
      },
    });
    return { message: 'Berita berhasil dibuat', statusCode: 201 };
  }
  public async updateNews(
    userId: number,
    newsId: number,
    updateNewsDTO: UpdateNewsDTO,
    file?: Express.Multer.File,
  ): Promise<ResponseDTO> {
    const newsItem = await this.prismaService.news.findUnique({
      where: { id: newsId, deletedAt: { equals: null } },
    });
    if (!newsItem) throw new NotFoundException('Berita tidak ditemukan');
    const updateData: Prisma.NewsUpdateInput = {
      user: { connect: { userId } },
      title: updateNewsDTO.title,
      article: updateNewsDTO.article,
      updatedAt: new Date(),
    };
    if (file) {
      const imageUrl = await this.supabaseService.uploadFile(
        Bucket.NEWS,
        file,
        userId.toString(),
      );
      if (Array.isArray(imageUrl))
        throw new ConflictException('Unggahan gambar gagal');
      updateData['headerImage'] = imageUrl.url;
    }
    await this.prismaService.news.update({
      where: { id: newsId },
      data: updateData,
    });
    return {
      message: 'Berita berhasil diperbarui',
      statusCode: 200,
    };
  }
  public async deleteNews(newsId: number): Promise<ResponseDTO> {
    const newsItem = await this.prismaService.news.findUnique({
      where: { id: newsId },
    });
    if (!newsItem) throw new NotFoundException('Berita tidak ditemukan');
    await this.prismaService.news.update({
      where: {
        id: newsId,
        deletedAt: {
          equals: null,
        },
      },
      data: { deletedAt: new Date() },
    });
    return {
      message: 'Berita berhasil dihapus',
      statusCode: 200,
    };
  }
}
