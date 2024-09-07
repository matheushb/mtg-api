import { INestApplication, ValidationPipe } from '@nestjs/common';

export default function appConfig(nestApp: INestApplication<any>) {
  nestApp.useGlobalPipes(new ValidationPipe());
}
