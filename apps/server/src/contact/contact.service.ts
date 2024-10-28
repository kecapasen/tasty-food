import { Injectable, NotFoundException } from '@nestjs/common';
import { Contact } from '@repo/db';
import { CreateContactDTO, GetContactDTO, ResponseDTO } from '@repo/dto';
import { PrismaService } from 'src/lib';

@Injectable()
export class ContactService {
  constructor(private readonly prismaService: PrismaService) {}

  public async getAllContacts(): Promise<
    ResponseDTO & {
      data?: GetContactDTO[];
    }
  > {
    const contacts = await this.prismaService.contact.findMany({
      orderBy: [{ id: 'desc' }],
    });
    if (contacts.length < 1)
      throw new NotFoundException('Kontak tidak ditemukan');
    return {
      message: 'Daftar kontak berhasil diambil',
      statusCode: 200,
      data: contacts,
    };
  }
  public async getContactById(contactId: number): Promise<
    ResponseDTO & {
      data?: GetContactDTO;
    }
  > {
    const contact = await this.prismaService.contact.findUnique({
      where: {
        id: contactId,
      },
    });
    if (!contact) throw new NotFoundException('Kontak tidak ditemukan');
    return {
      message: 'Kontak berhasil diambil',
      statusCode: 200,
      data: contact,
    };
  }
  public async createNewContact(
    createContactDTO: CreateContactDTO,
  ): Promise<ResponseDTO> {
    await this.prismaService.contact.create({
      data: {
        ...createContactDTO,
        createdAt: new Date(),
      },
    });
    return { message: 'Kontak berhasil dibuat', statusCode: 201 };
  }
}
