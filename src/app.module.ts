import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { AppController } from './app.controller';

@Module({
  imports: [UserModule, AuthModule, PrismaModule],
  controllers: [AppController],
})
export class AppModule {}
