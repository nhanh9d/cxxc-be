import { Injectable } from '@nestjs/common';
import { UserService } from '../user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService) {
  }

  async loginWithFirebase(firebaseId: string) {
    const existingUser = await this.userService.findByFirebaseId(firebaseId);

    if (existingUser) {
      const payload = {
        sub: existingUser.id,
        fullname: existingUser.fullname,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30
      };
      const data = {
        accessToken: await this.jwtService.signAsync(payload),
      };

      return data;
    }
  }
}
