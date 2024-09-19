import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
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
import { redisStore } from 'cache-manager-redis-yet';

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
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => ({
        store: redisStore,
        socket: {
          host: 'localhost',
          port: 6379,
        },
      }),
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
