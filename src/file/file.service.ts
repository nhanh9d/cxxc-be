import { Injectable } from '@nestjs/common';
import * as Minio from 'minio';

@Injectable()
export class FileService {
  private minioClient: Minio.Client;
  constructor() {
    this.minioClient = new Minio.Client({
      endPoint: '1cfc-14-232-206-135.ngrok-free.app',
      useSSL: true,
      accessKey: 'WuPiCTOhLJaIKz7LbzTK',
      secretKey: 'xz7WkmlpLsIwaUfzR38se1dJzSNg3wITXDYRJmVj',
    })
  }

  async getPresignedUrl(userId: string, fileName: string) {
    const url = await this.minioClient.presignedPutObject("user", `${userId}/${fileName}`);
    console.log(url);
    return url;
  }
}
