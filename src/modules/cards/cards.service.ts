import { BadRequestException, Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { CardsRepository } from './cards.repository';
import { CreateCardDto } from './dtos/create-card.dto';
import { UpdateCardDto } from './dtos/update-card.dto';

@Injectable()
export class CardsService {
  constructor(
    private readonly cardsRepository: CardsRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async create(createCardDto: CreateCardDto) {
    if (isNaN(new Date(createCardDto.released_date).getTime())) {
      throw new BadRequestException('Invalid Date');
    }
    createCardDto.released_date = new Date(createCardDto.released_date);
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
