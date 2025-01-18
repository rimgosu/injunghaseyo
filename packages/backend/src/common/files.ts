import {
  FileValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';

export const getFileValidationPipe = () => {
  return new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
      new CustomFileTypeValidator({}),
    ],
  });
};

export class CustomFileTypeValidator extends FileValidator {
  private readonly allowedMimeTypes = [
    'image/jpeg', // jpg, jpeg
    'image/png', // png
    'image/svg+xml', // svg
    'image/heic', // iOS HEIC
    'image/heif', // iOS HEIF
    'image/webp', // WebP
    'image/gif', // GIF
  ];

  isValid(file?: Express.Multer.File): boolean {
    if (!file) {
      return false;
    }

    return this.allowedMimeTypes.includes(file.mimetype);
  }

  buildErrorMessage(): string {
    return `파일 형식은 ${this.allowedMimeTypes.join(', ')} 중 하나여야 합니다.`;
  }
}
