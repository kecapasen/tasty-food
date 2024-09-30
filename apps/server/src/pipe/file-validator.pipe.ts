import {
  Injectable,
  PipeTransform,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ParseFilePipeBuilder } from '@nestjs/common/pipes';

@Injectable()
export class FileValidatorPipe implements PipeTransform {
  constructor(private readonly isRequired: boolean) {}
  transform(file: Express.Multer.File) {
    if (this.isRequired && !file) {
      throw new HttpException(
        'File is required but not provided',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!this.isRequired && !file) {
      return file;
    }
    const fileValidator = new ParseFilePipeBuilder()
      .addFileTypeValidator({
        fileType: /^image\//,
      })
      .addMaxSizeValidator({
        maxSize: 5e6, // 5 MB
      })
      .build({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    return fileValidator.transform(file);
  }
}
