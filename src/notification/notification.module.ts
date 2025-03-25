import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entity/notification.entity';
import { NotificationService } from './notification.service';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';
import { NotificationController } from './notification.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    RabbitMQModule,
  ],
  providers: [NotificationService],
  controllers: [NotificationController],
  exports: [NotificationService],
})
export class NotificationModule {} 