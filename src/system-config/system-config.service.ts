import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemConfig, ConfigType } from './entity/system-config.entity';
import { CreateSystemConfigDto, UpdateSystemConfigDto } from './dto/system-config.dto';
import * as crypto from 'crypto';

@Injectable()
export class SystemConfigService {
  constructor(
    @InjectRepository(SystemConfig)
    private readonly systemConfigRepository: Repository<SystemConfig>,
  ) {}
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

  async findAll(): Promise<SystemConfig[]> {
    return this.systemConfigRepository.find();
  }

  async findByKey(key: string): Promise<SystemConfig> {
    const config = await this.systemConfigRepository.findOne({ where: { key } });
    if (!config) {
      throw new NotFoundException(`Không tìm thấy cấu hình với key ${key}`);
    }
    return config;
  }

  async getValue(key: string): Promise<string> {
    const config = await this.findByKey(key);
    if (config.isEncrypted) {
      return this.decryptValue(config.value);
    }
    return config.value;
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

  async remove(key: string): Promise<void> {
    const config = await this.findByKey(key);
    await this.systemConfigRepository.remove(config);
  }

  async findByType(type: ConfigType): Promise<SystemConfig[]> {
    return this.systemConfigRepository.find({ where: { type } });
  }
} 