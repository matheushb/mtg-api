import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { AppController } from './app.controller';
import { BcryptModule } from './common/bcrypt/bcrypt.module';
import { ConfigModule } from '@nestjs/config';
import envConfig from './common/config/env-config';
import { ScyfallModule } from './gateways/scyfall.module';
import { CardsModule } from './modules/cards/cards.module';
import { DecksModule } from './modules/deck/cards.module';
import { CardDeckModule } from './modules/card-deck/card-deck.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    BcryptModule,
    CardsModule,
    DecksModule,
    CardDeckModule,
    ScyfallModule,
    ConfigModule.forRoot({ load: [envConfig], isGlobal: true }),
  ],
  controllers: [AppController],
})
export class AppModule {}
