import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from './config/database.config';
import { FileModule } from './file/file.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { EventModule } from './event/event.module';
import { SharedModule } from './shared/shared.module';
import { NotificationModule } from './notification/notification.module';
import { SystemConfigModule } from './system-config/system-config.module';  

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forRoot(dbConfig),
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
