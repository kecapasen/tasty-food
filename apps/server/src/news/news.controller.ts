import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { StaffOnly } from 'src/auth/auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from 'src/auth/user.decorator';
import { FileValidatorPipe } from 'src/pipe/file-validator.pipe';
import {
  CreateNewsDTO,
  GetNewsDTO,
  ResponseDTO,
  UpdateNewsDTO,
} from '@repo/dto';
import { Role } from '@repo/db';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}
  @Get()
  public async getAllNews(): Promise<ResponseDTO & { data?: GetNewsDTO[] }> {
    return await this.newsService.getAllNews();
  }
  @Get(':newsId')
  public async getNewsById(
    @Param('newsId', ParseIntPipe) newsId: number,
  ): Promise<ResponseDTO & { data?: GetNewsDTO }> {
    return await this.newsService.getNewsById(newsId);
  }
  @UseGuards(JwtAuthGuard)
  @StaffOnly(Role.ADMIN)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  public async createNews(
    @User('userId', ParseIntPipe) userId: number,
    @Body() createNewsDTO: CreateNewsDTO,
    @UploadedFile(new FileValidatorPipe(true)) file: Express.Multer.File,
  ): Promise<ResponseDTO> {
    return await this.newsService.createNews(userId, createNewsDTO, file);
  }
  @UseGuards(JwtAuthGuard)
  @StaffOnly(Role.ADMIN)
  @Patch(':newsId')
  @UseInterceptors(FileInterceptor('file'))
  public async updateNews(
    @User('userId', ParseIntPipe) userId: number,
    @Param('newsId', ParseIntPipe) newsId: number,
    @Body() updateNewsDTO: UpdateNewsDTO,
    @UploadedFile(new FileValidatorPipe(false)) file?: Express.Multer.File,
  ): Promise<ResponseDTO> {
    return await this.newsService.updateNews(
      userId,
      newsId,
      updateNewsDTO,
      file,
    );
  }
  @UseGuards(JwtAuthGuard)
  @StaffOnly(Role.ADMIN)
  @Delete(':newsId')
  public async deleteNews(
    @Param('newsId', ParseIntPipe) newsId: number,
  ): Promise<ResponseDTO> {
    return await this.newsService.deleteNews(newsId);
  }
}
