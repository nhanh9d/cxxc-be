import { Injectable } from '@nestjs/common';
import * as Minio from 'minio';

@Injectable()
export class FileService {
  private minioClient: Minio.Client;
  constructor() {
    this.minioClient = new Minio.Client({
      endPoint: '288b-2401-d800-91c1-d3f1-c449-6648-7c0a-aee2.ngrok-free.app',
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
