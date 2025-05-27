import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemConfig, ConfigType, DataType } from './entity/system-config.entity';
import { CreateSystemConfigDto, SystemConfigDto, UpdateSystemConfigDto } from './dto/system-config.dto';
import * as crypto from 'crypto';

@Injectable()
export class SystemConfigService {
  constructor(
    @InjectRepository(SystemConfig)
    private readonly systemConfigRepository: Repository<SystemConfig>,
  ) { }
  //YZaQsaujUmZDXlA87OaoIXWtGPwe2qnA/VFxdXtc9las54bLdw7pGYOtO7PZJEJV

  private encryptValue(value: string): string {
    const algorithm = 'aes-256-cbc';
    const key = Buffer.from(process.env.ENCRYPTION_KEY || 'YZaQsaujUmZDXlA87OaoIXWtGPwe2qnA', 'utf8');
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(value, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
  }

  private decryptValue(encryptedValue: string): string {
    const algorithm = 'aes-256-cbc';
    const key = Buffer.from(process.env.ENCRYPTION_KEY || 'YZaQsaujUmZDXlA87OaoIXWtGPwe2qnA', 'utf8');
    const [ivHex, encrypted] = encryptedValue.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }


  async create(createDto: CreateSystemConfigDto): Promise<SystemConfig> {
    const config = this.systemConfigRepository.create(createDto);

    if (config.isEncrypted) {
      config.value = this.encryptValue(config.value);
    }

    return this.systemConfigRepository.save(config);
  }

  async findAll(): Promise<SystemConfigDto[]> {
    const configs = await this.systemConfigRepository.find({ where: { isActive: true } });

    return configs.map(config => config.isEncrypted ? { ...config, value: this.decryptValue(config.value) } : { ...config });
  }

  async findByKey(key: string): Promise<SystemConfigDto> {
    const config = await this.systemConfigRepository.findOne({ where: { key, isActive: true } });
    if (!config) {
      throw new NotFoundException(`Không tìm thấy cấu hình với key ${key}`);
    }

    if (config.isEncrypted) {
      config.value = this.decryptValue(config.value);
    }

    return config;
  }

  async getValue(key: string): Promise<string> {
    const config = await this.findByKey(key);
    return config.isEncrypted ? this.decryptValue(config.value) : config.value;
  }

  async update(key: string, updateDto: UpdateSystemConfigDto): Promise<SystemConfig> {
    const config = await this.findByKey(key);

    // Nếu có cập nhật giá trị và cấu hình được mã hóa
    if (updateDto.value && config.isEncrypted) {
      updateDto.value = this.encryptValue(updateDto.value);
    }

    Object.assign(config, updateDto);
    return this.systemConfigRepository.save(config);
  }

  async upsert(key: string, updateDto: CreateSystemConfigDto): Promise<SystemConfig> {
    if (updateDto.isEncrypted) {
      updateDto.value = this.encryptValue(updateDto.value);
    }

    await this.systemConfigRepository.upsert({ key, ...updateDto }, ['key']);
    return this.systemConfigRepository.findOne({ where: { key } });
  }

  async remove(key: string): Promise<void> {
    const config = await this.systemConfigRepository.findOne({ where: { key } });
    await this.systemConfigRepository.remove(config);
  }

  async findByType(type: ConfigType): Promise<SystemConfigDto[]> {
    const configs = await this.systemConfigRepository.find({ where: { type, isActive: true } });

    return configs.map(config => config.isEncrypted ? { ...config, value: this.decryptValue(config.value) } : { ...config });
  }

  async getConfigValueByKey(key: string): Promise<any> {
    const config = await this.findByKey(key);
    return config.dataType === DataType.JSON ? JSON.parse(config.value) : config.value;
  }
} 