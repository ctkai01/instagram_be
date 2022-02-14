import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { getManager } from 'typeorm';
import { AppModule } from './app.module';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  await getManager().query(`SET GLOBAL time_zone = 'Asia/Ho_Chi_Minh';`);
  await getManager().query(`SET time_zone = 'Asia/Ho_Chi_Minh';`);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('/api');
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    index: false,
    prefix: '/',
  });
  await app.listen(5000);
}
bootstrap();
