import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Vehicle } from '../vehicle/entity/vehicle.entity';
import { AuthService } from './auth/auth.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Vehicle])
  ],
  controllers: [UserController],
  providers: [UserService, AuthService, { provide: APP_GUARD, useClass: AuthGuard }],
  exports: [TypeOrmModule, UserService]
})
export class UserModule { }
