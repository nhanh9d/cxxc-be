import { Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { UserDto } from './dto/user.dto';
import { SignInResultDto } from './dto/signin-result.dto';
import { AuthService } from './auth/auth.service';
import { Public } from 'src/shared/decorators/public.decorator';
import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService) { }

  @Public()
  @Get("/firebase/:id")
  async getUserById(@Param("id") id: string): Promise<SignInResultDto> {
    return await this.authService.loginWithFirebase(id);
  }

  @Public()
  @Post("/firebase")
  async createUser(@Body() payload: UserDto): Promise<User> {
    return await this.userService.createUser(payload);
  }

  @Public()
  @Put("/firebase/:id")
  async updateUser(@Body() payload: UserDto, @Param("id") id: string): Promise<User> {
    return await this.userService.updateUser(payload, id);
  }

  @Get('me')
  async getMe(@Req() request: Request) {
    return await this.userService.findById(request.user.sub);
  }

  @Put('push-token')
  async updatePushToken(@Req() request: Request, @Body('pushToken') pushToken: string) {
    const userId = request.user.sub;
    await this.userService.updatePushToken(userId, pushToken);
    return { message: 'Push token updated successfully' };
  }
}
