import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { SiteService } from './site.service';
import { GetSiteDTO, ResponseDTO, UpdateSiteDTO } from '@repo/dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { StaffOnly } from 'src/auth/auth.decorator';
import { Role } from '@repo/db';

@Controller('site')
export class SiteController {
  constructor(private readonly siteService: SiteService) {}

  @Get()
  public async getSite(): Promise<ResponseDTO & { data?: GetSiteDTO }> {
    const data = await this.siteService.getSite();
    return data;
  }
  @UseGuards(JwtAuthGuard)
  @StaffOnly(Role.ADMIN)
  @Patch()
  public async updateSite(
    @Body() updateSiteDTO: UpdateSiteDTO,
  ): Promise<ResponseDTO> {
    const data = await this.siteService.updateSite(updateSiteDTO);
    return data;
  }
}
