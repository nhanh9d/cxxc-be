import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class RabbitMQService {
  constructor(
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
  ) {}

  async emit(pattern: string, data: any) {
    try {
      return await lastValueFrom(this.client.emit(pattern, data));
    } catch (error) {
      console.error('Error emitting event:', error);
      throw error;
    }
  }

  async send(pattern: string, data: any) {
    try {
      return await lastValueFrom(this.client.send(pattern, data));
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
} 