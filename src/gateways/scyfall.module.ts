import { Module } from '@nestjs/common';
import { ScyfallGateway } from './scyfall.gateway';
import { ScyfallController } from './scyfall.controller';
import { CardsModule } from 'src/modules/cards/cards.module';
import { DecksModule } from 'src/modules/deck/cards.module';
import { CardDeckModule } from 'src/modules/card-deck/card-deck.module';

@Module({
  imports: [CardsModule, DecksModule, CardDeckModule],
  providers: [ScyfallGateway],
  exports: [ScyfallGateway],
  controllers: [ScyfallController],
})
export class ScyfallModule {}
