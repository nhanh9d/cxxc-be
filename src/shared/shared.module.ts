import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { DiscordLogger } from './services/discord.log.service';

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
  providers: [DiscordLogger],
  exports: [JwtModule, DiscordLogger]
})
export class SharedModule { }

