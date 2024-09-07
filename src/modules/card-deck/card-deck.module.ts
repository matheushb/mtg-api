import { Module } from '@nestjs/common';
import { CardDeckController } from './card-deck.controller';
import { CardDeckService } from './card-deck.service';
import { CardDeckRepository } from './card-deck.repository';

@Module({
  controllers: [CardDeckController],
  providers: [CardDeckService, CardDeckRepository],
})
export class CardDeckModule {}
