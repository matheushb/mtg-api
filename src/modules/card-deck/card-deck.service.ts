import { Injectable } from '@nestjs/common';
import { CardDeckRepository } from './card-deck.repository';
import { CreateCardDeckDto } from './dtos/create-card-deck.dto';
import { UpdateCardDeckDto } from './dtos/update-card-deck.dto';

@Injectable()
export class CardDeckService {
  constructor(private readonly cardDeckRepository: CardDeckRepository) {}

  async create(createCardDeckDto: CreateCardDeckDto) {
    const createdCardDeck = await this.cardDeckRepository.create(
      createCardDeckDto,
    );

    return createdCardDeck;
  }

  async findAll() {
    const cardDeck = await this.cardDeckRepository.findAll();

    return cardDeck;
  }

  async findOne(card_id: string, deck_id: string) {
    const cardDeck = await this.cardDeckRepository.findOne(card_id, deck_id);

    return cardDeck;
  }

  async update(
    card_id: string,
    deck_id: string,
    updateCardDeckDto: UpdateCardDeckDto,
  ) {
    const updatedCardDeck = await this.cardDeckRepository.update(
      card_id,
      deck_id,
      updateCardDeckDto,
    );

    return updatedCardDeck;
  }

  async delete(card_id: string, deck_id: string) {
    await this.cardDeckRepository.delete(card_id, deck_id);
  }
}
