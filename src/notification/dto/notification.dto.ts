import { NotificationType } from '../entity/notification.entity';
import { UserDto } from '../../user/dto/user.dto';

export class NotificationDto {
  id: string;
  type: NotificationType;
  title: string;
  content: string;
  metadata: Record<string, any>;
  isRead: boolean;
  isPushed: boolean;
  user: UserDto;
  userId: number;
  createdAt: Date;
}