import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { UserDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Test } from './entity/test.entity';

@Controller('user')
export class UserController {
  constructor(
      @InjectRepository(Test)
      private testRepository: Repository<Test>,
      private readonly userService: UserService) { }

  @Get("/test")
  async test(): Promise<boolean> {
    console.log('here');
    await this.testRepository.insert({profileImages: ["abc","def"]});
    return true;
  }

  @Get("/firebase/:id")
  async getUserById(@Param("id") id: string): Promise<UserDto> {
    return await this.userService.findByFirebaseId(id);
  }

  @Post("/firebase")
  async createUser(@Body() payload: UserDto): Promise<User> {
    return await this.userService.createUser(payload);
  }

  @Put("/firebase/:id")
  async updateUser(@Body() payload: UserDto): Promise<boolean>{
    return await this.userService.updateUser(payload);
  }
}
