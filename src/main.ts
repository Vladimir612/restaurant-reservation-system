import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();

  const corsOrigins = process.env.CORS_ORIGINS?.split(',') ?? [];

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  });

  const config = new DocumentBuilder()
    .setTitle('Reservation System API')
    .setDescription('API documentation for Reservations and Restaurants')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = Number(process.env.PORT) || 5000;
  await app.listen(port);

  const url = await app.getUrl();
  Logger.log(`Server is running on: ${url}`, 'Bootstrap');
  Logger.log(`Swagger Docs available at: ${url}/docs`, 'Bootstrap');
}

bootstrap();
