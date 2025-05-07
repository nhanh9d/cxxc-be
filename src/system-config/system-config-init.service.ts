import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SystemConfigService } from './system-config.service';
import { ConfigType, DataType } from './entity/system-config.entity';

@Injectable()
export class SystemConfigInitService implements OnModuleInit {
  private readonly logger = new Logger(SystemConfigInitService.name);
  constructor(private readonly systemConfigService: SystemConfigService) { }

  async onModuleInit() {
    const feConfig = {
      apiUrl: "https://api.cxxc.vn",
      fileUrl: "https://file.cxxc.vn",
      minio: {
        useSSL: true,
        endPoint: "https://file.cxxc.vn",
        port: 443
      }
    };

    try {
      // Kiểm tra xem config đã tồn tại chưa
      const existingConfig = await this.systemConfigService.findByKey('fe.config').catch(() => null);

      if (existingConfig) {
        this.logger.log('Frontend config already exists');
        return;
      }

      // Nếu chưa tồn tại, tạo mới
      await this.systemConfigService.create({
        key: 'fe.config',
        description: 'Frontend configuration',
        type: ConfigType.GENERAL,
        dataType: DataType.JSON,
        value: JSON.stringify(feConfig),
        isEncrypted: true
      });

      this.logger.log('Frontend config initialized successfully');
    } catch (error) {
      this.logger.error('Error initializing frontend config:', error);
    }
  }
} 