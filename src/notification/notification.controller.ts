import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { RMQ_PATTERNS } from '../rabbitmq/constants';
import { EventPattern } from '@nestjs/microservices';
import { Request } from 'express';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) { }

  @Get('my')
  getMyNotifications(@Req() request: Request) {
    return this.notificationService.getMyNotifications(request.user.sub);
  }

  @Post(':id/read')
  markAsRead(@Param('id') id: string, @Req() request: Request) {
    return this.notificationService.markAsRead(id, request.user.sub);
  }

  @Post('read-all')
  markAllAsRead(@Req() request: Request) {
    return this.notificationService.markAllAsRead(request.user.sub);
  }

  @EventPattern(RMQ_PATTERNS.EVENT.MEMBER_JOINED)
  async handleEventMemberJoined(data: {
    eventName: string;
    userId: number;
    fullname: string;
    avatar: string;
    joinedAt: Date;
  }) {
    return this.notificationService.handleEventMemberJoined(data);
  }

  @EventPattern(RMQ_PATTERNS.NOTIFICATION.CREATED)
  async handleNotificationCreated(data: {
    notificationId: string;
  }) {
    return this.notificationService.handleNotificationCreated(data.notificationId);
  }

  @EventPattern(RMQ_PATTERNS.EVENT.FINISHED)
  async handleEventFinished(data: {
    eventId: number;
  }) {
    return this.notificationService.handleEventFinished(data.eventId);
  }
} 