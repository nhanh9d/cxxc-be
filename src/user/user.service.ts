import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  /**
   *
   */
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>) {
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
      return await this.usersRepository.save({ ...user });
    }

    return await this.findByFirebaseId(user.firebaseId);
  }

  async updateUser(user: UserDto) {
    const existingUser = await this.findByFirebaseId(user.firebaseId);

    if (!existingUser) {
      return false;
    }

    const updatedUser = { ...existingUser, ...user };
    const updateResult = await this.usersRepository.save(updatedUser);

    return !!updateResult;
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
}
