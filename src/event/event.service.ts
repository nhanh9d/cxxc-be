import { Injectable } from '@nestjs/common';
import { EditEventDto, EventDto, RegisterEventDto } from './dto/event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entity/event.entity';
import { Repository } from 'typeorm';
import slugify from 'slugify';
import { TokenInformationDto } from 'src/user/dto/token-info.dto';
import { EventMember, MemberStatus, RoleType } from './entity/event-member.entity';
import { User } from 'src/user/entity/user.entity';
import { EventInvitation, InvitationStatus } from './entity/event-invitation.entity';

@Injectable()
export class EventService {
  /**
   *
   */
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(EventMember)
    private readonly eventMemberRepository: Repository<EventMember>,
    @InjectRepository(EventInvitation)
    private readonly eventInvitationRepository: Repository<EventInvitation>,
    @InjectRepository(User)
    private userRepository: Repository<User>,) {
  }

  async getEventById(id: number) {
    return this.eventRepository.findOneBy({ id });
  }

  async getEventStatistic(id: number) {
    const event = await this.eventRepository.findOne({ where: { id } });

    if (!event) {
      throw new Error('Không tìm thấy chuyến đi');
    }

    const invitedNo = await this.eventInvitationRepository.count({ where: { event } });
    const rejectedNo = await this.eventInvitationRepository.count({ where: { event, status: InvitationStatus.rejected } });
    const members = await this.eventMemberRepository.find({ where: { event }, relations: ['user'] });

    return { event, invitedNo, rejectedNo, members }
  }

  async getPagedData(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [events, total] = await this.eventRepository.findAndCount({ 
      skip,
      take: limit,
      order: {
        createdAt: 'DESC'
      }
    });

    return {
      data: events,
      total,
      page,
      limit
    };
  }

  async createNewEvent(payload: EventDto, creator: TokenInformationDto) {
    const slug = slugify(payload.name.toLowerCase());
    const user = await this.userRepository.findOneBy({ id: creator.sub });

    if (!user) {
      throw new Error("Người dùng không tồn tại");
    }

    const event = await this.eventRepository.save({
      ...payload,
      slug,
      creator: user
    });

    await this.eventMemberRepository.save({
      event,
      user,
      memberRole: RoleType.host,
      status: MemberStatus.confirmed
    })

    return event
  }

  async updateEvent(payload: EditEventDto, creator: TokenInformationDto) {
    const slug = slugify(payload.name.toLowerCase());
    const user = await this.userRepository.findOneBy({ id: creator.sub });

    if (!user) {
      throw new Error("Người dùng không tồn tại");
    }

    const event = await this.eventRepository.findOne({ where: { id: payload.id } });
    if (!event) {
      throw new Error('Không tìm thấy chuyến đi');
    }

    this.eventRepository.merge(event, { ...payload, slug });
    return await this.eventRepository.save(event);
  }

  async registerEvent(payload: RegisterEventDto, memberToken: TokenInformationDto) {
    const user = await this.userRepository.findOneBy({ id: memberToken.sub });

    if (!user) {
      throw new Error("Người dùng không tồn tại");
    }

    const event = await this.eventRepository.findOne({ where: { id: payload.id } });
    if (!event) {
      throw new Error('Không tìm thấy chuyến đi');
    }

    const member = await this.eventMemberRepository.save({
      memberRole: RoleType.member,
      status: MemberStatus.registered,
      user,
      event
    });

    //notify

    return member;
  }
}
