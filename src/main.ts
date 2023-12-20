import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('LifeHub')
    .setDescription('The LifeHub API description')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    credentials: true,
    origin: ['https://b8c0-188-225-50-141.ngrok-free.app'],
    methods: 'PUT, POST, PATCH, DELETE, GET',
    allowedHeaders: [
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Origin',
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'ngrok-skip-browser-warning',
      'user-agent',
    ],
    preflightContinue: false,
  });

  await app.listen(3011);
}
bootstrap();
