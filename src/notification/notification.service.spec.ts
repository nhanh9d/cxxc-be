import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Notification, EventMemberNotificationType, EventNotificationType } from './entity/notification.entity';
import { Repository } from 'typeorm';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { UserService } from '../user/user.service';
import { EventService } from '../event/event.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let notificationRepository: Repository<Notification>;
  let rabbitMQService: RabbitMQService;
  let userService: UserService;
  let eventService: EventService;

  const mockNotificationRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    update: jest.fn()
  };

  const mockRabbitMQService = {
    emit: jest.fn()
  };

  const mockUserService = {
    findById: jest.fn()
  };

  const mockEventService = {
    getEventById: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: getRepositoryToken(Notification),
          useValue: mockNotificationRepository
        },
        {
          provide: RabbitMQService,
          useValue: mockRabbitMQService
        },
        {
          provide: UserService,
          useValue: mockUserService
        },
        {
          provide: EventService,
          useValue: mockEventService
        }
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    notificationRepository = module.get<Repository<Notification>>(getRepositoryToken(Notification));
    rabbitMQService = module.get<RabbitMQService>(RabbitMQService);
    userService = module.get<UserService>(UserService);
    eventService = module.get<EventService>(EventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createNotification', () => {
    it('should create a notification and emit event', async () => {
      const notificationData = {
        type: EventMemberNotificationType.EVENT_MEMBER_JOINED,
        title: 'Test Title',
        content: 'Test Content',
        metadata: { key: 'value' },
        userId: 1
      };
      const mockNotification = { id: 'notif123', ...notificationData };
      
      mockNotificationRepository.create.mockReturnValue(mockNotification);
      mockNotificationRepository.save.mockResolvedValue(mockNotification);

      const result = await service.createNotification(notificationData);
      expect(result).toEqual(mockNotification);
      expect(mockNotificationRepository.create).toHaveBeenCalledWith(notificationData);
      expect(mockNotificationRepository.save).toHaveBeenCalledWith(mockNotification);
      expect(mockRabbitMQService.emit).toHaveBeenCalledWith('notification.created', {
        notificationId: 'notif123'
      });
    });
  });

  describe('handleEventMemberJoined', () => {
    it('should create a notification for event member joined', async () => {
      const eventData = {
        eventName: 'Test Event',
        userId: 1,
        fullname: 'Test User',
        avatar: 'avatar.jpg',
        joinedAt: new Date()
      };
      const mockNotification = { id: 'notif123' };
      
      jest.spyOn(service, 'createNotification').mockResolvedValue(mockNotification);

      const result = await service.handleEventMemberJoined(eventData);
      expect(result).toEqual(mockNotification);
      expect(service.createNotification).toHaveBeenCalledWith({
        type: EventMemberNotificationType.EVENT_MEMBER_JOINED,
        title: "Có thành viên tham gia chuyến đi",
        content: `Test User đã đồng ý tham gia "Test Event"`,
        metadata: {
          avatar: 'avatar.jpg',
          joinedAt: eventData.joinedAt,
          fullname: 'Test User',
          eventName: 'Test Event',
        },
        userId: 1,
      });
    });
  });

  describe('getMyNotifications', () => {
    it('should return notifications for a user', async () => {
      const mockNotifications = [{ id: 'notif123', userId: 1 }];
      mockNotificationRepository.find.mockResolvedValue(mockNotifications);

      const result = await service.getMyNotifications(1);
      expect(result).toEqual(mockNotifications);
      expect(mockNotificationRepository.find).toHaveBeenCalledWith({
        where: { userId: 1 },
        order: { createdAt: 'DESC' },
        relations: ['user'],
      });
    });
  });

  describe('markAsRead', () => {
    it('should mark a notification as read', async () => {
      await service.markAsRead('notif123', 1);
      expect(mockNotificationRepository.update).toHaveBeenCalledWith(
        { id: 'notif123', userId: 1 },
        { isRead: true }
      );
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read for a user', async () => {
      await service.markAllAsRead(1);
      expect(mockNotificationRepository.update).toHaveBeenCalledWith(
        { userId: 1 },
        { isRead: true }
      );
    });
  });

  describe('markAsPushed', () => {
    it('should mark a notification as pushed', async () => {
      await service.markAsPushed('notif123');
      expect(mockNotificationRepository.update).toHaveBeenCalledWith(
        { id: 'notif123' },
        { isPushed: true }
      );
    });
  });

  describe('handleEventFinished', () => {
    it('should create notifications for all event members', async () => {
      const mockEvent = {
        id: 1,
        banner: 'banner.jpg',
        members: [
          { user: { id: 1 } },
          { user: { id: 2 } }
        ]
      };
      
      mockEventService.getEventById.mockResolvedValue(mockEvent);
      jest.spyOn(service, 'createNotification').mockResolvedValue({ id: 'notif123' });

      await service.handleEventFinished(1);
      expect(mockEventService.getEventById).toHaveBeenCalledWith(1, ['members']);
      expect(service.createNotification).toHaveBeenCalledTimes(2);
    });
  });
});