import { Injectable, OnModuleInit } from '@nestjs/common';
import { SystemConfigService } from './system-config.service';
import { ConfigType, DataType } from './entity/system-config.entity';

@Injectable()
export class SystemConfigInitService implements OnModuleInit {
  constructor(private readonly systemConfigService: SystemConfigService) {}

  async onModuleInit() {
    const feConfig = {
      apiUrl: "https://96ca-2401-d800-91c1-d3f1-c449-6648-7c0a-aee2.ngrok-free.app",
      fileUrl: "https://288b-2401-d800-91c1-d3f1-c449-6648-7c0a-aee2.ngrok-free.app",
      fileUser: "cxxc",
      filePassword: "cxxc@123",
      minio: {
        accessKey: "IxuuYWSIdf8XFpw6WvAD",
        secretKey: "jD4Z79wGwD1Va5DO4sO487LzUyl12vhwYQwWxthN",
        useSSL: true,
        endPoint: "https://288b-2401-d800-91c1-d3f1-c449-6648-7c0a-aee2.ngrok-free.app",
        port: 443
      }
    };

    try {
      // Kiểm tra xem config đã tồn tại chưa
      const existingConfig = await this.systemConfigService.findByKey('fe.config').catch(() => null);
      
      if (!existingConfig) {
        // Nếu chưa tồn tại, tạo mới
        await this.systemConfigService.create({
          key: 'fe.config',
          description: 'Frontend configuration',
          type: ConfigType.GENERAL,
          dataType: DataType.JSON,
          value: JSON.stringify(feConfig),
          isEncrypted: true
        });
        console.log('Frontend config initialized successfully');
      } else {
        console.log('Frontend config already exists');
      }
    } catch (error) {
      console.error('Error initializing frontend config:', error);
    }
  }
} 