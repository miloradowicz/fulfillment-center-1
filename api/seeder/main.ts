import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SeederModule } from './seeder.module';
import { SeederService } from './seeder.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(SeederModule);
  const seeder = app.get(SeederService);
  seeder.seed();
  await app.close();
}
bootstrap().catch(console.error);
