import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make it accessible globally
      envFilePath: '.env', // Default is '.env', but specify explicitly if needed
      ignoreEnvFile: process.env.NODE_ENV === 'production',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [JwtModule]
})
export class SharedModule { }

