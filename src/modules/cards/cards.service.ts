import { Injectable } from '@nestjs/common';
import { CardsRepository } from './cards.repository';
import { CreateCardDto } from './dtos/create-card.dto';
import { UpdateCardDto } from './dtos/update-card.dto';

@Injectable()
export class CardsService {
  constructor(private readonly cardsRepository: CardsRepository) {}

  async create(createCardDto: CreateCardDto) {
    return await this.cardsRepository.create(createCardDto);
  }

  async findAll() {
    const cards = await this.cardsRepository.findAll();

    return cards;
  }

  async findOne(id: string) {
    const card = await this.cardsRepository.findOne(id);
    return {
      data: card,
    };
  }

  async update(id: string, updateCardDto: UpdateCardDto) {
    const updatedCard = await this.cardsRepository.update(id, updateCardDto);
    return {
      data: updatedCard,
    };
  }

  async delete(id: string) {
    await this.cardsRepository.delete(id);
  }
}
