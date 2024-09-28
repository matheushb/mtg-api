import { Injectable } from '@nestjs/common';

import {
  allowedFilters,
  DeckFilterParams,
} from 'src/common/filters/deck/deck-filter.params';
import { DeckSelectParams } from 'src/common/filters/deck/deck-select.params';
import { DecksRepository } from './deck.repository';
import { CreateDeckDto } from './dtos/create-deck.dto';
import { UpdateDeckDto } from './dtos/update-deck.dto';

@Injectable()
export class DecksService {
  constructor(private readonly decksRepository: DecksRepository) {}

  async create(createDeckDto: CreateDeckDto) {
    return await this.decksRepository.create(createDeckDto);
  }

  async findAll(deckFilter: DeckFilterParams, deckSelect: DeckSelectParams) {
    const filter = {};

    for (const allowedFilter of allowedFilters) {
      if (deckFilter[allowedFilter]) {
        if (allowedFilter === 'userId') {
          filter['user_id'] = deckFilter[allowedFilter];
        }
      }
    }

    return await this.decksRepository.findAll(filter, deckSelect);
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
