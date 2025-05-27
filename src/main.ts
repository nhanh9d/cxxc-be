import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LogRequestHeaderMiddleware } from './shared/middleware/log-request-header.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(new LogRequestHeaderMiddleware().use);

  const config = new DocumentBuilder()
    .setTitle('Chơi xe xe chơi')
    .setDescription('Tài liệu API Chơi xe xe chơi')
    .setVersion('1.0')
    .addTag('cxxc')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
