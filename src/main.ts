import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //ignorar propriedades extras enviadas para as apis e respeitar o schema definido
      errorHttpStatusCode: 422, //unprocessable entity
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
