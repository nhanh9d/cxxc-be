import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ConfigType, DataType } from '../entity/system-config.entity';

export class SystemConfigDto {
  @ApiProperty({ description: 'Khóa cấu hình, phải là duy nhất' })
  @IsString()
  @IsNotEmpty()
  key: string;

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

export class CreateSystemConfigDto extends SystemConfigDto {
  @ApiProperty({ description: 'Mô tả về cấu hình' })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateSystemConfigDto extends CreateSystemConfigDto {
  @ApiProperty({ description: 'Khóa cấu hình, phải là duy nhất' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Trạng thái kích hoạt' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}