import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { AppController } from './app.controller';
import { BcryptModule } from './common/bcrypt/bcrypt.module';
import { ConfigModule } from '@nestjs/config';
import envConfig from './common/config/env-config';
import { ScyfallModule } from './gateways/scyfall.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    PrismaModule,
    BcryptModule,
    ScyfallModule,
    ConfigModule.forRoot({ load: [envConfig], isGlobal: true }),
  ],
  controllers: [AppController],
})
export class AppModule {}
