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
import { UserService } from './user.service';
import { StaffOnly } from 'src/auth/auth.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/auth/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidatorPipe } from 'src/pipe/file-validator.pipe';
import { Role } from '@repo/db';
import {
  CreateUserDTO,
  GetUserDTO,
  ResponseDTO,
  UpdateUserDTO,
} from '@repo/dto';

@UseGuards(JwtAuthGuard)
@StaffOnly(Role.ADMIN)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  public async getAllUsers(
    @User('userId', ParseIntPipe) userId: number,
  ): Promise<ResponseDTO & { data?: GetUserDTO[] }> {
    return await this.userService.getAllUsers(userId);
  }
  @Get(':employeeId')
  public async getUserById(
    @Param('employeeId', ParseIntPipe) employeeId: number,
  ): Promise<ResponseDTO & { data?: GetUserDTO }> {
    return await this.userService.getUserById(employeeId);
  }
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  public async createUser(
    @Body() createUserDTO: CreateUserDTO,
    @UploadedFile(new FileValidatorPipe(false))
    file?: Express.Multer.File,
  ): Promise<ResponseDTO> {
    return await this.userService.createUser(createUserDTO, file);
  }
  @Patch(':employeeId')
  @UseInterceptors(FileInterceptor('file'))
  public async updateUser(
    @Param('employeeId', ParseIntPipe) employeeId: number,
    @Body() updateUserDTO: UpdateUserDTO,
    @UploadedFile(new FileValidatorPipe(false))
    file?: Express.Multer.File,
  ): Promise<ResponseDTO> {
    return await this.userService.updateUser(employeeId, updateUserDTO, file);
  }
  @Delete(':employeeId')
  public async deleteUser(
    @Param('employeeId', ParseIntPipe) employeeId: number,
  ): Promise<ResponseDTO> {
    return await this.userService.deleteUser(employeeId);
  }
}
