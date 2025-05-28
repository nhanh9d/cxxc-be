import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService) {
  }

  async loginWithFirebase(firebaseId: string) {
    const existingUser = await this.userRepository.findOneBy({ firebaseId });

    if (existingUser) {
      const data = {
        accessToken: await this.signToken(existingUser),
      };

      return data;
    }
  }

  async signToken(user: User) {
    const payload = {
      sub: user.id,
      fullname: user.fullname,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30
    };

    return this.jwtService.signAsync(payload);
  }
}
