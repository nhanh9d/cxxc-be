import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileModule } from './file/file.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { EventModule } from './event/event.module';
import { SharedModule } from './shared/shared.module';
import { NotificationModule } from './notification/notification.module';
import { SystemConfigModule } from './system-config/system-config.module';
import { AppDataSource } from '../data-source';

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forRoot(AppDataSource.options),
    UserModule,
    FileModule,
    VehicleModule,
    EventModule,
    NotificationModule,
    SystemConfigModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
