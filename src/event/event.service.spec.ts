import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from './event.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Event } from './entity/event.entity';
import { EventMember } from './entity/event-member.entity';
import { EventInvitation } from './entity/event-invitation.entity';
import { User } from '../user/entity/user.entity';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { Repository } from 'typeorm';
import { InvitationStatus } from './entity/event-invitation.entity';
import { MemberStatus, RoleType } from './entity/event-member.entity';
import { TokenInformationDto } from '../user/dto/token-information.dto';
import { EventDto } from './dto/event.dto';
import { EditEventDto } from './dto/edit-event.dto';
import { RegisterEventDto } from './dto/register-event.dto';

describe('EventService', () => {
  let service: EventService;
  let eventRepository: Repository<Event>;
  let eventMemberRepository: Repository<EventMember>;
  let eventInvitationRepository: Repository<EventInvitation>;
  let userRepository: Repository<User>;
  let rabbitMQService: RabbitMQService;

  const mockEventRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
      getCount: jest.fn()
    })),
    findOneBy: jest.fn()
  };

  const mockEventMemberRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    count: jest.fn()
  };

  const mockEventInvitationRepository = {
    count: jest.fn()
  };

  const mockUserRepository = {
    findOneBy: jest.fn()
  };

  const mockRabbitMQService = {
    emit: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        {
          provide: getRepositoryToken(Event),
          useValue: mockEventRepository
        },
        {
          provide: getRepositoryToken(EventMember),
          useValue: mockEventMemberRepository
        },
        {
          provide: getRepositoryToken(EventInvitation),
          useValue: mockEventInvitationRepository
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository
        },
        {
          provide: RabbitMQService,
          useValue: mockRabbitMQService
        }
      ],
    }).compile();

    service = module.get<EventService>(EventService);
    eventRepository = module.get<Repository<Event>>(getRepositoryToken(Event));
    eventMemberRepository = module.get<Repository<EventMember>>(getRepositoryToken(EventMember));
    eventInvitationRepository = module.get<Repository<EventInvitation>>(getRepositoryToken(EventInvitation));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    rabbitMQService = module.get<RabbitMQService>(RabbitMQService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getEventById', () => {
    it('should return an event by id', async () => {
      const mockEvent = { id: 1, name: 'Test Event' };
      mockEventRepository.findOne.mockResolvedValue(mockEvent);

      const result = await service.getEventById(1);
      expect(result).toEqual(mockEvent);
      expect(mockEventRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: [] });
    });
  });

  describe('getEventStatistic', () => {
    it('should return event statistics', async () => {
      const mockEvent = { id: 1, name: 'Test Event' };
      const mockMembers = [{ id: 1, user: { id: 1 } }];
      mockEventRepository.findOne.mockResolvedValue(mockEvent);
      mockEventInvitationRepository.count.mockResolvedValueOnce(5);
      mockEventInvitationRepository.count.mockResolvedValueOnce(2);
      mockEventMemberRepository.find.mockResolvedValue(mockMembers);

      const result = await service.getEventStatistic(1);
      expect(result).toEqual({ 
        event: mockEvent, 
        invitedNo: 5, 
        rejectedNo: 2, 
        members: mockMembers 
      });
    });

    it('should throw error if event not found', async () => {
      mockEventRepository.findOne.mockResolvedValue(null);
      
      await expect(service.getEventStatistic(1)).rejects.toThrow('Không tìm thấy chuyến đi');
    });
  });

  describe('getPagedData', () => {
    it('should return paged events', async () => {
      const mockEvents = [{ id: 1, name: 'Test Event' }];
      const mockQueryBuilder = eventRepository.createQueryBuilder();
      mockQueryBuilder.getMany.mockResolvedValue(mockEvents);

      const result = await service.getPagedData(0, 10, false, 1);
      expect(result).toEqual(mockEvents);
    });
  });

  describe('createNewEvent', () => {
    it('should create a new event', async () => {
      const eventDto: EventDto = { name: 'New Event', description: 'Test' };
      const user: TokenInformationDto = { sub: 1, fullname: 'Test User' };
      const mockEvent = { id: 1, name: 'New Event', slug: 'new-event' };
      
      mockEventRepository.save.mockResolvedValue(mockEvent);

      const result = await service.createNewEvent(eventDto, user);
      expect(result).toEqual(mockEvent);
      expect(mockEventRepository.save).toHaveBeenCalledWith({
        ...eventDto,
        slug: 'new-event',
        creator: { id: 1 }
      });
    });
  });

  describe('updateEvent', () => {
    it('should update an event', async () => {
      const editEventDto: EditEventDto = { id: 1, name: 'Updated Event' };
      const user: TokenInformationDto = { sub: 1, fullname: 'Test User' };
      const mockEvent = { id: 1, name: 'Old Event' };
      const updatedEvent = { id: 1, name: 'Updated Event', slug: 'updated-event' };
      
      mockEventRepository.findOne.mockResolvedValue(mockEvent);
      mockEventRepository.save.mockResolvedValue(updatedEvent);

      const result = await service.updateEvent(editEventDto, user);
      expect(result).toEqual(updatedEvent);
      expect(mockRabbitMQService.emit).toHaveBeenCalled();
    });

    it('should throw error if event not found', async () => {
      const editEventDto: EditEventDto = { id: 1, name: 'Updated Event' };
      const user: TokenInformationDto = { sub: 1, fullname: 'Test User' };
      
      mockEventRepository.findOne.mockResolvedValue(null);

      await expect(service.updateEvent(editEventDto, user)).rejects.toThrow('Event not found');
    });
  });

  describe('registerEvent', () => {
    it('should register a user for an event', async () => {
      const registerEventDto: RegisterEventDto = { id: 1 };
      const user: TokenInformationDto = { sub: 1, fullname: 'Test User' };
      const mockUser = { id: 1, fullname: 'Test User', profileImages: ['avatar.jpg'] };
      const mockEvent = { id: 1, name: 'Test Event' };
      const mockMember = { 
        memberRole: RoleType.member, 
        status: MemberStatus.registered,
        user: mockUser,
        event: mockEvent,
        createdAt: new Date()
      };
      
      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      mockEventRepository.findOne.mockResolvedValue(mockEvent);
      mockEventMemberRepository.findOne.mockResolvedValue(null);
      mockEventMemberRepository.save.mockResolvedValue(mockMember);

      const result = await service.registerEvent(registerEventDto, user);
      expect(result).toEqual(mockMember);
      expect(mockRabbitMQService.emit).toHaveBeenCalled();
    });

    it('should throw error if user not found', async () => {
      const registerEventDto: RegisterEventDto = { id: 1 };
      const user: TokenInformationDto = { sub: 1, fullname: 'Test User' };
      
      mockUserRepository.findOneBy.mockResolvedValue(null);

      await expect(service.registerEvent(registerEventDto, user)).rejects.toThrow('Người dùng không tồn tại');
    });

    it('should throw error if event not found', async () => {
      const registerEventDto: RegisterEventDto = { id: 1 };
      const user: TokenInformationDto = { sub: 1, fullname: 'Test User' };
      const mockUser = { id: 1, fullname: 'Test User' };
      
      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      mockEventRepository.findOne.mockResolvedValue(null);

      await expect(service.registerEvent(registerEventDto, user)).rejects.toThrow('Không tìm thấy chuyến đi');
    });

    it('should throw error if user already registered', async () => {
      const registerEventDto: RegisterEventDto = { id: 1 };
      const user: TokenInformationDto = { sub: 1, fullname: 'Test User' };
      const mockUser = { id: 1, fullname: 'Test User' };
      const mockEvent = { id: 1, name: 'Test Event' };
      const mockMember = { id: 1, user: mockUser, event: mockEvent };
      
      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      mockEventRepository.findOne.mockResolvedValue(mockEvent);
      mockEventMemberRepository.findOne.mockResolvedValue(mockMember);

      await expect(service.registerEvent(registerEventDto, user)).rejects.toThrow('Bạn đã đăng ký chuyến đi này rồi');
    });
  });

  describe('getEventCount', () => {
    it('should return event count', async () => {
      const mockQueryBuilder = eventRepository.createQueryBuilder();
      mockQueryBuilder.getCount.mockResolvedValue(5);

      const result = await service.getEventCount(1);
      expect(result).toEqual({ count: 5 });
    });
  });

  describe('leaveEvent', () => {
    it('should allow user to leave an event', async () => {
      const user: TokenInformationDto = { sub: 1, fullname: 'Test User' };
      mockEventMemberRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.leaveEvent(1, user);
      expect(mockEventMemberRepository.delete).toHaveBeenCalledWith({
        event: { id: 1 },
        user: { id: 1 }
      });
      expect(mockRabbitMQService.emit).toHaveBeenCalled();
      expect(result).toEqual({ affected: 1 });
    });

    it('should not emit event if no records affected', async () => {
      const user: TokenInformationDto = { sub: 1, fullname: 'Test User' };
      mockEventMemberRepository.delete.mockResolvedValue({ affected: 0 });

      await service.leaveEvent(1, user);
      expect(mockRabbitMQService.emit).not.toHaveBeenCalled();
    });
  });
});