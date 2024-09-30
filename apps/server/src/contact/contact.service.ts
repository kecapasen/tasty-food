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
    const contacts: GetContactDTO[] = (
      await this.prismaService.contact.findMany()
    ).map((contact: Contact): GetContactDTO => {
      return {
        subject: contact.subject,
        name: contact.name,
        email: contact.email,
        message: contact.message,
        createdAt: contact.createdAt,
      };
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
    const contactData: GetContactDTO = {
      subject: contact.subject,
      name: contact.name,
      email: contact.email,
      message: contact.message,
      createdAt: contact.createdAt,
    };
    return {
      message: 'Kontak berhasil diambil',
      statusCode: 200,
      data: contactData,
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
