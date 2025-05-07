import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Migration');

  const dataSource = app.get(DataSource);
  try {
    await dataSource.initialize();
  } catch (error) {
    logger.log("Already initialized");
  }
  const migration = await dataSource.runMigrations();
  logger.log(`Migration completed: ${migration.length} migrations applied`);

  const config = new DocumentBuilder()
    .setTitle('CXXC')
    .setDescription('CXXC API description')
    .setVersion('1.0')
    .addTag('cxxc')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
