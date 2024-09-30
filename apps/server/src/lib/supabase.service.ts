import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Bucket } from 'src/interfaces';

@Injectable()
export class SupabaseService {
  constructor(private readonly configService: ConfigService) {}

  private clientInstance: SupabaseClient;
  private getClient() {
    if (this.clientInstance) return this.clientInstance;
    this.clientInstance = createClient(
      this.configService.getOrThrow<string>('SUPABASE_URL'),
      this.configService.getOrThrow<string>('SUPABASE_KEY'),
    );
    return this.clientInstance;
  }
  public async uploadFile(
    bucket: Bucket,
    file: Express.Multer.File | Express.Multer.File[],
    fileName?: string,
  ) {
    const upload = async (file: Express.Multer.File) => {
      const fileExtension = file.mimetype.toString().split('/')[1];
      const filePath = `${crypto.randomUUID()}-${fileName || ''}.${fileExtension}`;
      const { data, error } = await this.getClient()
        .storage.from(bucket)
        .upload(filePath, file.buffer);
      if (error) throw new UnprocessableEntityException(error);
      const uploadedFilePublicUrl = this.getClient()
        .storage.from(bucket)
        .getPublicUrl(data.path);
      return { url: uploadedFilePublicUrl.data.publicUrl };
    };
    if (Array.isArray(file)) {
      const uploadPromises = file.map(upload);
      return await Promise.all(uploadPromises);
    } else {
      return await upload(file);
    }
  }
}
