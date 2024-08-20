import { Module } from '@nestjs/common';
import { ScyfallGateway } from './scyfall.gateway';
import { ScyfallController } from './scyfall.controller';

@Module({
  providers: [ScyfallGateway],
  exports: [ScyfallGateway],
  controllers: [ScyfallController],
})
export class ScyfallModule {}
