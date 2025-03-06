import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  /**
   *
   */
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService) {
  }

  async loginWithFirebase(firebaseId: string) {
    const existingUser = await this.findByFirebaseId(firebaseId);

    if (existingUser) {
      const payload = { sub: existingUser.id, fullname: existingUser.fullname };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    }
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
}
