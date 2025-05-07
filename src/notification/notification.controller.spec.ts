import { Test, TestingModule } from '@nestjs/testing';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

describe('NotificationController', () => {
  let controller: NotificationController;
  let service: NotificationService;

  const mockNotificationService = {
    getMyNotifications: jest.fn(),
    markAsRead: jest.fn(),
    markAllAsRead: jest.fn(),
    handleEventMemberJoined: jest.fn(),
    handleNotificationCreated: jest.fn(),
    handleEventFinished: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [
        {
          provide: NotificationService,
          useValue: mockNotificationService
        }
      ],
    }).compile();

    controller = module.get<NotificationController>(NotificationController);
    service = module.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMyNotifications', () => {
    it('should return notifications for the current user', async () => {
      const mockNotifications = [{ id: 'notif123', userId: 1 }];
      mockNotificationService.getMyNotifications.mockResolvedValue(mockNotifications);

      const result = await controller.getMyNotifications({ user: { sub: 1 } });
      expect(result).toEqual(mockNotifications);
      expect(mockNotificationService.getMyNotifications).toHaveBeenCalledWith(1);
    });
  });

  describe('markAsRead', () => {
    it('should mark a notification as read', async () => {
      await controller.markAsRead('notif123', { user: { sub: 1 } });
      expect(mockNotificationService.markAsRead).toHaveBeenCalledWith('notif123', 1);
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read', async () => {
      await controller.markAllAsRead({ user: { sub: 1 } });
      expect(mockNotificationService.markAllAsRead).toHaveBeenCalledWith(1);
    });
  });

  describe('handleEventMemberJoined', () => {
    it('should handle event member joined notification', async () => {
      const eventData = {
        eventName: 'Test Event',
        userId: 1,
        fullname: 'Test User',
        avatar: 'avatar.jpg',
        joinedAt: new Date()
      };
      
      await controller.handleEventMemberJoined(eventData);
      expect(mockNotificationService.handleEventMemberJoined).toHaveBeenCalledWith(eventData);
    });
  });

  describe('handleNotificationCreated', () => {
    it('should handle notification created event', async () => {
      const data = { notificationId: 'notif123' };
      
      await controller.handleNotificationCreated(data);
      expect(mockNotificationService.handleNotificationCreated).toHaveBeenCalledWith('notif123');
    });
  });

  describe('handleEventFinished', () => {
    it('should handle event finished notification', async () => {
      const data = { eventId: 1 };
      
      await controller.handleEventFinished(data);
      expect(mockNotificationService.handleEventFinished).toHaveBeenCalledWith(1);
    });
  });
});