import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { RMQ_PATTERNS } from '../rabbitmq/constants';
import { EventPattern } from '@nestjs/microservices';
import { Request } from 'express';
import { Event } from 'src/event/entity/event.entity';
import { Public } from 'src/shared/decorators/public.decorator';
import { UserStatus } from 'src/user/entity/user.entity';
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

  @Public()
  @Get("/test-notification")
  async testNotification(): Promise<void> {
    await this.notificationService.handleEventCreated({
      id: 1,
      name: "Test Event",
      slug: "test-event",
      banner: "https://via.placeholder.com/150",
      startDate: new Date(),
      endDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      startLocation: "Hà Nội",
      members: [],
      rules: [],
      invitations: [],
      creator: {
        id: 1,
        fullname: "Test User",
        phone: "0909090909",
        firebaseId: "test-firebase-id",
        pushToken: "test-push-token",
        isActive: true,
        birthday: new Date(),
        gender: "male",
        status: UserStatus.verified,
        createdAt: new Date(),
        updatedAt: new Date(),
        profileImages: [],
        vehicles: [],
        eventMemberships: [],
        sentInvitations: [],
        receivedInvitations: [],
        verificationImages: [],
        createdEvents: [],
        interests: [],
      },
    });
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
    pushToken?: string
  }) {
    return this.notificationService.handleNotificationCreated(data.notificationId, data.pushToken);
  }

  @EventPattern(RMQ_PATTERNS.EVENT.FINISHED)
  async handleEventFinished(data: {
    eventId: number;
  }) {
    return this.notificationService.handleEventFinished(data.eventId);
  }

  //listen event created
  @EventPattern(RMQ_PATTERNS.EVENT.CREATED)
  async listenEventCreated(event: Event) {
    await this.notificationService.handleEventCreated(event);
  }
} 