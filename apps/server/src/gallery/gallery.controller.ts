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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { StaffOnly } from 'src/auth/auth.decorator';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { User } from 'src/auth/user.decorator';
import { FileValidatorPipe } from 'src/pipe/file-validator.pipe';
import { CreateGalleryDTO, GetGalleryDTO, ResponseDTO } from '@repo/dto';
import { Role } from '@repo/db';

@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Get()
  public async getAllGalleries(): Promise<
    ResponseDTO & { data?: GetGalleryDTO[] }
  > {
    return await this.galleryService.getAllGalleries();
  }
  @UseGuards(JwtAuthGuard)
  @StaffOnly(Role.ADMIN)
  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  public async createGallery(
    @User('userId', ParseIntPipe) userId: number,
    @Body() createGalleryDTO: CreateGalleryDTO,
    @UploadedFiles(new FileValidatorPipe(true)) files: Express.Multer.File[],
  ): Promise<ResponseDTO> {
    return await this.galleryService.createGallery(
      userId,
      files,
      createGalleryDTO,
    );
  }
  @UseGuards(JwtAuthGuard)
  @StaffOnly(Role.ADMIN)
  @Patch(':galleryId')
  @UseInterceptors(FileInterceptor('file'))
  public async updateGallery(
    @User('userId', ParseIntPipe) userId: number,
    @Param('galleryId', ParseIntPipe) galleryId: number,
    @UploadedFile(new FileValidatorPipe(true)) file: Express.Multer.File,
  ): Promise<ResponseDTO> {
    return await this.galleryService.updateGallery(userId, galleryId, file);
  }
  @UseGuards(JwtAuthGuard)
  @StaffOnly(Role.ADMIN)
  @Delete(':galleryId')
  public async deleteGallery(
    @Param('galleryId', ParseIntPipe) galleryId: number,
  ): Promise<ResponseDTO> {
    return await this.galleryService.deleteGallery(galleryId);
  }
}
