import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { DecksRepository } from './deck.repository';
import { CreateDeckDto } from './dtos/create-deck.dto';
import { UpdateDeckDto } from './dtos/update-deck.dto';

@Injectable()
export class DecksService {
  constructor(
    private readonly decksRepository: DecksRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async create(createDeckDto: CreateDeckDto) {
    return await this.decksRepository.create(createDeckDto);
  }

  async findAll() {
    const decks = await this.decksRepository.findAll();

    return decks;
  }

  async findOne(id: string) {
    const deck = await this.decksRepository.findOne(id);
    return {
      data: deck,
    };
  }

  async update(id: string, updateDeckDto: UpdateDeckDto) {
    const updatedDeck = await this.decksRepository.update(id, updateDeckDto);
    return {
      data: updatedDeck,
    };
  }

  async delete(id: string) {
    await this.decksRepository.delete(id);
  }
}
