import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../shared/entity/base.entity';

export enum ConfigType {
  GENERAL = 'GENERAL',
  NOTIFICATION = 'NOTIFICATION',
  SECURITY = 'SECURITY',
  FEATURE_FLAG = 'FEATURE_FLAG'
}

export enum DataType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  JSON = 'JSON'
}

@Entity()
export class SystemConfig extends BaseEntity {
  @Column({ unique: true })
  key: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: ConfigType })
  type: ConfigType;

  @Column({ type: 'enum', enum: DataType })
  dataType: DataType;

  @Column({ type: 'text' })
  value: string;

  @Column({ default: false })
  isEncrypted: boolean;

  @Column({ default: true })
  isActive: boolean;
} 