import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventMemberNotificationType, EventNotificationType, Notification, NotificationType } from './entity/notification.entity';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { RMQ_PATTERNS } from '../rabbitmq/constants';
import { UserService } from '../user/user.service';
import admin from '../config/firebase.config';
import { EventService } from 'src/event/event.service';
@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    private readonly rabbitMQService: RabbitMQService,
    private readonly userService: UserService,
    private readonly eventService: EventService,
  ) { }

  async createNotification(data: {
    type: NotificationType;
    title: string;
    content: string;
    metadata: Record<string, any>;
    userId: number;
  }) {
    const notification = this.notificationRepository.create(data);
    await this.notificationRepository.save(notification);

    // Emit notification created event with user's pushToken
    await this.rabbitMQService.emit(RMQ_PATTERNS.NOTIFICATION.CREATED, {
      notificationId: notification.id,
    });

    return notification;
  }

  async handleEventMemberJoined(data: {
    eventName: string;
    userId: number;
    fullname: string;
    avatar: string;
    joinedAt: Date;
  }) {
    const { eventName, userId, fullname, avatar, joinedAt } = data;

    return this.createNotification({
      type: EventMemberNotificationType.EVENT_MEMBER_JOINED,
      title: "Có thành viên tham gia chuyến đi",
      content: `${fullname} đã đồng ý tham gia "${eventName}"`,
      metadata: {
        avatar,
        joinedAt,
        fullname,
        eventName,
      },
      userId,
    });
  }

  async handleNotificationCreated(notificationId: string) {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId },
    });
    const user = await this.userService.findById(notification.userId);

    if (!user?.pushToken) {
      return;
    }

    try {
      await admin.messaging().send({
        token: user.pushToken,
        notification: {
          title: notification.title,
          body: notification.content,
        },
        data: {
          notificationId: notification.id,
          type: notification.type,
          metadata: JSON.stringify(notification.metadata),
        },
      });

      // Đánh dấu notification đã được push
      await this.markAsPushed(notification.id);
    } catch (error) {
      console.error('Error sending FCM notification:', error);
    }
  }

  async getMyNotifications(userId: number) {
    return this.notificationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });
  }

  async markAsRead(notificationId: string, userId: number) {
    await this.notificationRepository.update(
      { id: notificationId, userId },
      { isRead: true },
    );
  }

  async markAllAsRead(userId: number) {
    await this.notificationRepository.update(
      { userId },
      { isRead: true },
    );
  }

  async markAsPushed(notificationId: string) {
    await this.notificationRepository.update(
      { id: notificationId },
      { isPushed: true },
    );
  }

  async handleEventFinished(eventId: number) {
    const event = await this.eventService.getEventById(eventId, ['members']);

    const promises: Promise<Notification>[] = [];
    for (const member of event.members) {
      promises.push(this.createNotification({
        type: EventNotificationType.EVENT_FINISHED,
        title: "Chuyến đi của bạn đã kết thúc!",
        content: `Hãy để lại đánh giá để giúp người tổ chức lắng nghe ý kiến của bạn.`,
        metadata: {
          eventImage: event.banner,
          eventId: event.id,
        },
        userId: member.user.id,
      }));
    }

    await Promise.all(promises);
  }
} 