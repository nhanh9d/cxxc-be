import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { Event } from './entity/event.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventRule } from './entity/event-rule.entity';
import { EventMember } from './entity/event-member.entity';
import { EventInvitation } from './entity/event-invitation.entity';
import { UserModule } from 'src/user/user.module';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';
import { EventSchedulerService } from './event-scheduler.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Event, EventRule, EventMember, EventInvitation]),
    UserModule,
    RabbitMQModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [EventController],
  providers: [EventService, EventSchedulerService],
  exports: [EventService, TypeOrmModule]
})
export class EventModule { }
