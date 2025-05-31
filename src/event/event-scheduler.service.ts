import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Not, Repository } from 'typeorm';
import { Event } from './entity/event.entity';
import { EventStatus } from './enum/event-status.enum';
import { RMQ_PATTERNS } from 'src/rabbitmq/constants';
import { RabbitMQService } from 'src/rabbitmq/rabbitmq.service';

@Injectable()
export class EventSchedulerService {
  private readonly logger = new Logger(EventSchedulerService.name);

  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updateExpiredEvents() {
    this.logger.log('Running job to update expired events...');

    const now = new Date();
    const expiredEvents = await this.eventRepository.find({
      where: {
        endDate: LessThan(now),
        status: Not(EventStatus.finished)
      }
    });

    if (expiredEvents.length === 0) {
      this.logger.log('No expired events found');
      return;
    }

    await this.eventRepository.update(
      expiredEvents.map(event => event.id),
      { status: EventStatus.finished }
    );

    // Gửi message queue cho các event đã hết hạn
    for (const event of expiredEvents) {
      this.logger.debug(`Đang gửi message queue cho event hết hạn có ID: ${event.id}`);
      // await this.rabbitMQService.emit(RMQ_PATTERNS.EVENT.FINISHED, {
      //   eventId: event.id,
      // });
    }

    this.logger.log(`Updated ${expiredEvents.length} expired events to finished status`);
  }
} 