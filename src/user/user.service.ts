import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { AuthService } from './auth/auth.service';

@Injectable()
export class UserService {
  /**
   *
   */
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private authService: AuthService
  ) {
  }

  async findByFirebaseId(firebaseId: string) {
    return await this.usersRepository.findOneBy({ firebaseId });
  }

  async existFirebaseId(firebaseId: string) {
    return await this.usersRepository.exists({ where: { firebaseId } });
  }

  async createUser(user: UserDto) {
    delete user.id;

    let hasUser = await this.existFirebaseId(user.firebaseId);

    if (!hasUser) {
      await this.usersRepository.save({ ...user });
    }

    const entity = await this.findByFirebaseId(user.firebaseId);

    return { ...entity, accessToken: await this.authService.signToken(entity) }
  }

  async updateUser(user: UserDto) {
    const existingUser = await this.findByFirebaseId(user.firebaseId);

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const updatedUser: User = { ...existingUser, ...user };
    await this.usersRepository.save(updatedUser);

    return { ...updatedUser, accessToken: await this.authService.signToken(updatedUser) };
  }

  async findById(id: number): Promise<User | null> {
    return await this.usersRepository.findOneBy({ id });
  }

  async findByPushToken(pushToken: string) {
    return await this.usersRepository.findOneBy({ pushToken });
  }

  async updatePushToken(userId: number, pushToken: string) {
    await this.usersRepository.update(userId, { pushToken });
  }

  async findUsersHasPushToken() {
    return await this.usersRepository.find({ where: { pushToken: Not(IsNull()) } });
  }
}
