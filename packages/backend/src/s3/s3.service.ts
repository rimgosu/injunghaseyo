import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly bucket: string;

  readonly profilePhotoDir = 'profile-photo';
  readonly proofPhotoDir = 'proof-photo';
  readonly groupPhotoDir = 'group-photo';

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    this.bucket = process.env.AWS_S3_BUCKET;
  }

  /**
   * @description 파일을 S3에 업로드
   */
  async uploadFile(file: Express.Multer.File, key: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3Client.send(command);
    return `${process.env.S3_URL}/${key}`;
  }

  /**
   * @description 파일명을 안전하게 인코딩
   */
  encodeFilename(filename: string): string {
    return Buffer.from(filename, 'utf8').toString('base64url');
  }

  /**
   * @description 인코딩된 파일명을 디코딩
   */
  decodeFilename(encodedFilename: string): string {
    return Buffer.from(encodedFilename, 'base64url').toString('utf8');
  }
}
