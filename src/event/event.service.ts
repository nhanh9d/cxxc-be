import { Injectable, Logger } from '@nestjs/common';
import { EditEventDto, EventDto, EventMemberDto, RegisterEventDto } from './dto/event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entity/event.entity';
import { Repository } from 'typeorm';
import slugify from 'slugify';
import { TokenInformationDto } from 'src/user/dto/token-info.dto';
import { EventMember, MemberStatus, RoleType } from './entity/event-member.entity';
import { EventInvitation, InvitationStatus } from './entity/event-invitation.entity';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { RMQ_PATTERNS } from '../rabbitmq/constants';
import { UserService } from 'src/user/user.service';
import { DiscordLogger } from '../shared/services/discord.log.service';

@Injectable()
export class EventService {
  /**
   *
   */
  private readonly logger = new Logger(EventService.name);
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(EventMember)
    private readonly eventMemberRepository: Repository<EventMember>,
    @InjectRepository(EventInvitation)
    private readonly eventInvitationRepository: Repository<EventInvitation>,
    private readonly rabbitMQService: RabbitMQService,
    private readonly userService: UserService,
    private readonly discordLogger: DiscordLogger
  ) {
  }

  async getEventById(id: number, relations: string[] = []) {
    return this.eventRepository.findOne({ where: { id }, relations });
  }

  async getEventStatistic(id: number) {
    const event = await this.eventRepository.findOne({ where: { id }, relations: ['creator'] });

    if (!event) {
      throw new Error('Không tìm thấy chuyến đi');
    }

    const invitedNo = await this.eventInvitationRepository.count({ where: { event } });
    const rejectedNo = await this.eventInvitationRepository.count({ where: { event, status: InvitationStatus.rejected } });
    const members = await this.eventMemberRepository.find({ where: { event }, relations: ['user'] });

    this.discordLogger.log(`event detail: ${JSON.stringify(event)}`);

    return { event, invitedNo, rejectedNo, members }
  }

  async getPagedData(page: number, limit: number, mine: boolean, userId: number) {
    const skip = page * limit;
    const qb = this.eventRepository.createQueryBuilder('event')
      .leftJoinAndSelect('event.members', 'members')
      .leftJoinAndSelect('event.rules', 'rules')
      .leftJoinAndSelect('event.creator', 'creator')
      .leftJoinAndSelect('members.user', 'user')
      .where(mine ? 'creator.id = :userId OR members.userId = :userId' : '1=1', { userId })
      .skip(skip)
      .take(limit)
      .orderBy('event.createdAt', 'DESC');

    const events = await qb.getMany();
    return events;
  }

  async createNewEvent(payload: EventDto, user: TokenInformationDto) {
    const slug = slugify(payload.name.toLowerCase());
    const event = await this.eventRepository.save({
      ...payload,
      slug,
      creator: { id: user.sub },
    });

    //add default member who is the creator
    await this.eventMemberRepository.save({
      status: MemberStatus.confirmed,
      memberRole: RoleType.host,
      user: { id: user.sub },
      event: { id: event.id }
    })

    // await this.rabbitMQService.emit(RMQ_PATTERNS.EVENT.CREATED, event);
    return event;
  }

  async updateEvent(payload: EditEventDto, user: TokenInformationDto) {
    const slug = slugify(payload.name.toLowerCase());
    const event = await this.eventRepository.findOne({
      where: { id: payload.id, creator: { id: user.sub } }
    });

    if (!event) {
      throw new Error('Event not found');
    }

    const updatedEvent = await this.eventRepository.save({
      ...event,
      ...payload,
      slug
    });

    await this.rabbitMQService.emit(RMQ_PATTERNS.EVENT.UPDATED, updatedEvent);
    return updatedEvent;
  }

  async registerEvent(payload: RegisterEventDto, memberToken: TokenInformationDto) {
    const user = await this.userService.findById(memberToken.sub);
    if (!user) {
      throw new Error("Người dùng không tồn tại");
    }

    const event = await this.eventRepository.findOne({ where: { id: payload.id } });
    if (!event) {
      throw new Error('Không tìm thấy chuyến đi');
    }

    const existingMember = await this.eventMemberRepository.findOne({
      where: {
        user: { id: user.id },
        event: { id: event.id }
      }
    });
    if (existingMember) {
      throw new Error('Bạn đã đăng ký chuyến đi này rồi');
    }

    const member = await this.eventMemberRepository.save({
      memberRole: RoleType.member,
      status: MemberStatus.registered,
      user,
      event
    });

    await this.rabbitMQService.emit(RMQ_PATTERNS.EVENT.MEMBER_JOINED, {
      eventName: event.name,
      userId: memberToken.sub,
      fullname: user.fullname,
      avatar: user.profileImages[0],
      joinedAt: member.createdAt
    });

    return member;
  }

  async getEventCount(userId: number, mine: boolean = false) {
    const qb = this.eventRepository.createQueryBuilder('event')
      .leftJoinAndSelect('event.members', 'members')
      .leftJoinAndSelect('event.creator', 'creator')
      .where(mine ? 'creator.id = :userId OR members.userId = :userId' : '1=1', { userId })

    const count = await qb.getCount();
    return { count };
  }

  async leaveEvent(eventId: number, user: TokenInformationDto) {
    const result = await this.eventMemberRepository.delete({
      event: { id: eventId },
      user: { id: user.sub }
    });

    if (result.affected > 0) {
      await this.rabbitMQService.emit(RMQ_PATTERNS.EVENT.MEMBER_LEFT, {
        eventId,
        userId: user.sub
      });
    }

    return result;
  }
}
