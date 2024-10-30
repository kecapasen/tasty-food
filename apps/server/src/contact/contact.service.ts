import { TZDate } from '@date-fns/tz';
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
    const responseData = contacts.map((item) => {
      return {
        ...item,
        createdAt: new TZDate(new Date(item.createdAt), 'Asia/Jakarta'),
      };
    });
    return {
      message: 'Daftar kontak berhasil diambil',
      statusCode: 200,
      data: responseData,
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
      data: {
        ...contact,
        createdAt: new TZDate(new Date(contact.createdAt), 'Asia/Jakarta'),
      },
    };
  }
  public async createNewContact(
    createContactDTO: CreateContactDTO,
  ): Promise<ResponseDTO> {
    await this.prismaService.contact.create({
      data: {
        ...createContactDTO,
        createdAt: new TZDate(new Date(), 'Asia/Jakarta'),
      },
    });
    return { message: 'Kontak berhasil dibuat', statusCode: 201 };
  }
}
