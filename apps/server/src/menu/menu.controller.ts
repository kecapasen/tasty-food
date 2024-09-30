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
import { MenuService } from './menu.service';
import { StaffOnly } from 'src/auth/auth.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from 'src/auth/user.decorator';
import { FileValidatorPipe } from 'src/pipe/file-validator.pipe';
import {
  CreateMenuDTO,
  GetMenuDTO,
  ResponseDTO,
  UpdateMenuDTO,
} from '@repo/dto';
import { Role } from '@repo/db';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  public async getAllMenus(): Promise<ResponseDTO & { data?: GetMenuDTO[] }> {
    return await this.menuService.getAllMenus();
  }
  @Get(':menuId')
  public async getMenuById(
    @Param('menuId', ParseIntPipe) menuId: number,
  ): Promise<ResponseDTO & { data?: GetMenuDTO }> {
    return await this.menuService.getMenuById(menuId);
  }
  @UseGuards(JwtAuthGuard)
  @StaffOnly(Role.ADMIN)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  public async createMenu(
    @User('userId', ParseIntPipe) userId: number,
    @Body() createMenuDTO: CreateMenuDTO,
    @UploadedFile(new FileValidatorPipe(true))
    file: Express.Multer.File,
  ): Promise<ResponseDTO> {
    return await this.menuService.createMenu(userId, createMenuDTO, file);
  }
  @UseGuards(JwtAuthGuard)
  @StaffOnly(Role.ADMIN)
  @Patch(':menuId')
  @UseInterceptors(FileInterceptor('file'))
  public async updateMenu(
    @User('userId', ParseIntPipe) userId: number,
    @Param('menuId', ParseIntPipe) menuId: number,
    @Body() updateMenuDTO: UpdateMenuDTO,
    @UploadedFile(new FileValidatorPipe(false))
    file?: Express.Multer.File,
  ): Promise<ResponseDTO> {
    return await this.menuService.updateMenu(
      userId,
      menuId,
      updateMenuDTO,
      file,
    );
  }
  @UseGuards(JwtAuthGuard)
  @StaffOnly(Role.ADMIN)
  @Delete(':menuId')
  public async deleteMenu(
    @Param('menuId', ParseIntPipe) menuId: number,
  ): Promise<ResponseDTO> {
    return await this.menuService.deleteMenu(menuId);
  }
}
