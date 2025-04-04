import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SystemConfigService } from './system-config.service';
import { CreateSystemConfigDto, UpdateSystemConfigDto } from './dto/system-config.dto';
import { SystemConfig, ConfigType } from './entity/system-config.entity';

@ApiTags('system-config')
@Controller('system-config')
export class SystemConfigController {
  constructor(private readonly systemConfigService: SystemConfigService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo mới cấu hình hệ thống' })
  @ApiResponse({ status: 201, description: 'Tạo mới thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  async create(@Body() createDto: CreateSystemConfigDto): Promise<SystemConfig> {
    return this.systemConfigService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách cấu hình hệ thống' })
  @ApiResponse({ status: 200, description: 'Lấy danh sách thành công' })
  async findAll(@Query('type') type?: ConfigType): Promise<SystemConfig[]> {
    if (type) {
      return this.systemConfigService.findByType(type);
    }
    return this.systemConfigService.findAll();
  }

  @Get(':key')
  @ApiOperation({ summary: 'Lấy cấu hình theo key' })
  @ApiResponse({ status: 200, description: 'Lấy cấu hình thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy cấu hình' })
  async findOne(@Param('key') key: string): Promise<SystemConfig> {
    return this.systemConfigService.findByKey(key);
  }

  @Get(':key/value')
  @ApiOperation({ summary: 'Lấy giá trị của cấu hình theo key' })
  @ApiResponse({ status: 200, description: 'Lấy giá trị thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy cấu hình' })
  async getValue(@Param('key') key: string): Promise<string> {
    return this.systemConfigService.getValue(key);
  }

  @Put(':key')
  @ApiOperation({ summary: 'Cập nhật cấu hình theo key' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy cấu hình' })
  async update(
    @Param('key') key: string,
    @Body() updateDto: UpdateSystemConfigDto,
  ): Promise<SystemConfig> {
    return this.systemConfigService.update(key, updateDto);
  }

  @Delete(':key')
  @ApiOperation({ summary: 'Xóa cấu hình theo key' })
  @ApiResponse({ status: 200, description: 'Xóa thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy cấu hình' })
  async remove(@Param('key') key: string): Promise<void> {
    return this.systemConfigService.remove(key);
  }
} 