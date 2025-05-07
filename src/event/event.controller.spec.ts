import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { EventDto } from './dto/event.dto';
import { EditEventDto } from './dto/edit-event.dto';
import { RegisterEventDto } from './dto/register-event.dto';

describe('EventController', () => {
  let controller: EventController;
  let service: EventService;

  const mockEventService = {
    getEventCount: jest.fn(),
    getPagedData: jest.fn(),
    getEventById: jest.fn(),
    getEventStatistic: jest.fn(),
    registerEvent: jest.fn(),
    createNewEvent: jest.fn(),
    updateEvent: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventController],
      providers: [
        {
          provide: EventService,
          useValue: mockEventService,
        },
      ],
    }).compile();

    controller = module.get<EventController>(EventController);
    service = module.get<EventService>(EventService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getEvents', () => {
    it('should return event count when count is true', async () => {
      const mockCount = { count: 5 };
      mockEventService.getEventCount.mockResolvedValue(mockCount);

      const result = await controller.getEvents(
        { user: { sub: 1 } },
        false,
        true,
        0,
        4
      );

      expect(result).toEqual(mockCount);
      expect(mockEventService.getEventCount).toHaveBeenCalledWith(1, false);
    });

    it('should return paged data when count is false', async () => {
      const mockEvents = [{ id: 1, name: 'Test Event' }];
      mockEventService.getPagedData.mockResolvedValue(mockEvents);

      const result = await controller.getEvents(
        { user: { sub: 1 } },
        false,
        false,
        0,
        4
      );

      expect(result).toEqual(mockEvents);
      expect(mockEventService.getPagedData).toHaveBeenCalledWith(0, 4, false, 1);
    });
  });

  describe('getEventById', () => {
    it('should return an event by id', async () => {
      const mockEvent = { id: 1, name: 'Test Event' };
      mockEventService.getEventById.mockResolvedValue(mockEvent);

      const result = await controller.getEventById(1);
      expect(result).toEqual(mockEvent);
      expect(mockEventService.getEventById).toHaveBeenCalledWith(1);
    });
  });

  describe('getEventStatistic', () => {
    it('should return event statistics', async () => {
      const mockStats = {
        event: { id: 1 },
        invitedNo: 5,
        rejectedNo: 2,
        members: []
      };
      mockEventService.getEventStatistic.mockResolvedValue(mockStats);

      const result = await controller.getEventStatistic(1);
      expect(result).toEqual(mockStats);
      expect(mockEventService.getEventStatistic).toHaveBeenCalledWith(1);
    });
  });

  describe('registerEvent', () => {
    it('should register a user for an event', async () => {
      const registerEventDto: RegisterEventDto = { id: 1 };
      const mockUser = { sub: 1, fullname: 'Test User' };
      const mockMember = { id: 1, user: mockUser };

      mockEventService.registerEvent.mockResolvedValue(mockMember);

      const result = await controller.registerEvent(registerEventDto, { user: mockUser });
      expect(result).toEqual(mockMember);
      expect(mockEventService.registerEvent).toHaveBeenCalledWith(registerEventDto, mockUser);
    });
  });

  describe('createEvent', () => {
    it('should create a new event', async () => {
      const eventDto: EventDto = { name: 'New Event', description: 'Test' };
      const mockUser = { sub: 1, fullname: 'Test User' };
      const mockEvent = { id: 1, name: 'New Event' };

      mockEventService.createNewEvent.mockResolvedValue(mockEvent);

      const result = await controller.createEvent(eventDto, { user: mockUser });
      expect(result).toEqual(mockEvent);
      expect(mockEventService.createNewEvent).toHaveBeenCalledWith(eventDto, mockUser);
    });
  });

  describe('updateEvent', () => {
    it('should update an event', async () => {
      const editEventDto: EditEventDto = { id: 1, name: 'Updated Event' };
      const mockUser = { sub: 1, fullname: 'Test User' };
      const mockEvent = { id: 1, name: 'Updated Event' };

      mockEventService.updateEvent.mockResolvedValue(mockEvent);

      const result = await controller.updateEvent(editEventDto, { user: mockUser });
      expect(result).toEqual(mockEvent);
      expect(mockEventService.updateEvent).toHaveBeenCalledWith(editEventDto, mockUser);
    });
  });
});