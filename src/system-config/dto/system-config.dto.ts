import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ConfigType, DataType } from '../entity/system-config.entity';

export class CreateSystemConfigDto {
  @ApiProperty({ description: 'Khóa cấu hình, phải là duy nhất' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ description: 'Mô tả về cấu hình' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Loại cấu hình', enum: ConfigType })
  @IsEnum(ConfigType)
  type: ConfigType;

  @ApiProperty({ description: 'Kiểu dữ liệu của giá trị', enum: DataType })
  @IsEnum(DataType)
  dataType: DataType;

  @ApiProperty({ description: 'Giá trị của cấu hình' })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty({ description: 'Có mã hóa giá trị hay không' })
  @IsBoolean()
  @IsOptional()
  isEncrypted?: boolean;
}

export class UpdateSystemConfigDto {
  @ApiProperty({ description: 'Mô tả về cấu hình' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Giá trị của cấu hình' })
  @IsString()
  @IsOptional()
  value?: string;

  @ApiProperty({ description: 'Có mã hóa giá trị hay không' })
  @IsBoolean()
  @IsOptional()
  isEncrypted?: boolean;

  @ApiProperty({ description: 'Trạng thái kích hoạt' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
} 