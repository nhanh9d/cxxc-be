import { Body, Controller, Get, Param, Post, Query, Req, Put } from '@nestjs/common';
import { EventService } from './event.service';
import { EditEventDto, EventDto, RegisterEventDto } from './dto/event.dto';
import { Request } from 'express';

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
  async getEvents(@Query('page') page: number, @Query('limit') limit: number) {
    return await this.eventService.getPagedData(page, limit);
  }

  @Get(':id')
  async getEventById(@Param('id') id: number) {
    return await this.eventService.getEventById(id);
  }

  @Get(':id/statistic')
  async getEventStatistic(@Param('id') id: number) {
    return await this.eventService.getEventStatistic(id);
  }

  @Post(':id/register')
  async registerEvent(@Body() payload: RegisterEventDto, @Req() request: Request) {
    console.log('Authenticated User:', request.user);
    return await this.eventService.registerEvent(payload, request.user);
  }

  @Post()
  async createEvent(@Body() payload: EventDto, @Req() request: Request) {
    console.log('Authenticated User:', request.user);
    return await this.eventService.createNewEvent(payload, request.user);
  }

  @Put()
  async updateEvent(@Body() payload: EditEventDto, @Req() request: Request) {
    console.log('Authenticated User:', request.user);
    return await this.eventService.updateEvent(payload, request.user);
  }
}
