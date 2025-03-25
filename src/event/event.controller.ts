import { Body, Controller, Get, Param, Post, Query, Req, Put } from '@nestjs/common';
import { EventService } from './event.service';
import { EditEventDto, EventDto, RegisterEventDto } from './dto/event.dto';
import { Request } from 'express';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('event')
@Controller('event')
export class EventController {
  /**
   *
   */
  constructor(
    private readonly eventService: EventService
  ) {

  }

  @Get()
  @ApiResponse({ status: 200, description: 'Lấy danh sách chuyến đi thành công' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 500, description: 'Lỗi server' })
  async getEvents(
    @Req() request: Request,
    @Query('mine') mine?: boolean,
    @Query('count') count?: boolean,
    @Query('page') page: number = 0, 
    @Query('limit') limit: number = 4,
  ) {
    if (count) {
      return await this.eventService.getEventCount(request.user.sub, mine);
    }
    return await this.eventService.getPagedData(page, limit, mine, request.user.sub);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Lấy thông tin chuyến đi thành công' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy chuyến đi' })
  @ApiResponse({ status: 500, description: 'Lỗi server' })
  async getEventById(@Param('id') id: number) {
    return await this.eventService.getEventById(id);
  }

  @Get(':id/statistic')
  @ApiResponse({ status: 200, description: 'Lấy thống kê chuyến đi thành công' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy chuyến đi' })
  @ApiResponse({ status: 500, description: 'Lỗi server' })
  async getEventStatistic(@Param('id') id: number) {
    return await this.eventService.getEventStatistic(id);
  }

  @Post(':id/register')
  @ApiResponse({ status: 201, description: 'Đăng ký tham gia chuyến đi thành công' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy chuyến đi' })
  @ApiResponse({ status: 400, description: 'Người dùng không tồn tại' })
  @ApiResponse({ status: 500, description: 'Lỗi server' })
  async registerEvent(@Body() payload: RegisterEventDto, @Req() request: Request) {
    console.log('Authenticated User:', request.user);
    return await this.eventService.registerEvent(payload, request.user);
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Tạo chuyến đi mới thành công' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 400, description: 'Người dùng không tồn tại' })
  @ApiResponse({ status: 500, description: 'Lỗi server' })
  async createEvent(@Body() payload: EventDto, @Req() request: Request) {
    console.log('Authenticated User:', request.user);
    return await this.eventService.createNewEvent(payload, request.user);
  }

  @Put()
  @ApiResponse({ status: 200, description: 'Cập nhật chuyến đi thành công' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy chuyến đi' })
  @ApiResponse({ status: 400, description: 'Người dùng không tồn tại' })
  @ApiResponse({ status: 500, description: 'Lỗi server' })
  async updateEvent(@Body() payload: EditEventDto, @Req() request: Request) {
    console.log('Authenticated User:', request.user);
    return await this.eventService.updateEvent(payload, request.user);
  }
}
