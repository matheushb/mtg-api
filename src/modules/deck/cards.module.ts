import { Module } from '@nestjs/common';
import { DecksController } from './deck.controller';
import { DecksService } from './deck.service';
import { DecksRepository } from './deck.repository';

@Module({
  controllers: [DecksController],
  providers: [DecksService, DecksRepository],
  exports: [DecksService],
})
export class DecksModule {}
