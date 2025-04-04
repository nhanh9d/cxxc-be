import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entity/notification.entity';
import { NotificationService } from './notification.service';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';
import { NotificationController } from './notification.controller';
import { UserModule } from 'src/user/user.module';
import { EventModule } from 'src/event/event.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    RabbitMQModule,
    UserModule,
    EventModule,
  ],
  providers: [NotificationService],
  controllers: [NotificationController],
  exports: [NotificationService],
})
export class NotificationModule {} 