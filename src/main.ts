import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import appConfig from './common/config/app-config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //https://api.scryfall.com/cards/search?q=type:legendary+type:creature&order=usd query
  //https://api.scryfall.com/cards/search?q=color=W+-type:legendary&order=usd query 2
  appConfig(app);
  await app.listen(3000);
}
bootstrap();
