import { Injectable } from '@nestjs/common';
import { GetSiteDTO, ResponseDTO, UpdateSiteDTO } from '@repo/dto';
import { PrismaService } from 'src/lib';

@Injectable()
export class SiteService {
  constructor(private readonly prismaService: PrismaService) {}

  public async getSite(): Promise<ResponseDTO & { data?: GetSiteDTO }> {
    const site = await this.prismaService.site.findUnique({
      where: {
        id: 1,
      },
    });
    return {
      message: 'Site berhasil diambil',
      statusCode: 200,
      data: site!,
    };
  }

  public async updateSite(updateSiteDTO: UpdateSiteDTO): Promise<ResponseDTO> {
    await this.prismaService.site.update({
      where: { id: 1 },
      data: { ...updateSiteDTO },
    });
    return {
      message: 'Site berhasil diperbarui',
      statusCode: 200,
    };
  }
}
