import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from './entity/test.entity';
import { Vehicle } from 'src/vehicle/entity/vehicle.entity';

@Module({
  imports: [JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      secret: configService.get<string>('SECRET'),
    }),
    inject: [ConfigService],
  }),
  TypeOrmModule.forFeature([User, Test, Vehicle])],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule { }
