import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { StaffOnly } from 'src/auth/auth.decorator';
import { Role } from '@repo/db';
import { CreateContactDTO, GetContactDTO, ResponseDTO } from '@repo/dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @UseGuards(JwtAuthGuard)
  @StaffOnly(Role.ADMIN)
  @Get()
  public async getAllContacts(): Promise<
    ResponseDTO & { data?: GetContactDTO[] }
  > {
    return await this.contactService.getAllContacts();
  }
  @UseGuards(JwtAuthGuard)
  @StaffOnly(Role.ADMIN, Role.CHEF, Role.WAITER)
  @Get(':contactId')
  public async getContactById(
    @Param('contactId', ParseIntPipe) contactId: number,
  ): Promise<ResponseDTO & { data?: GetContactDTO }> {
    return await this.contactService.getContactById(contactId);
  }
  @Post()
  public async createNewContact(
    @Body() createContactDTO: CreateContactDTO,
  ): Promise<ResponseDTO> {
    return await this.contactService.createNewContact(createContactDTO);
  }
}
