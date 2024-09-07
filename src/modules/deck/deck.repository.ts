import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateDeckDto } from './dtos/create-deck.dto';
import { UpdateDeckDto } from './dtos/update-deck.dto';

@Injectable()
export class DecksRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createDeckDto: CreateDeckDto) {
    return await this.prismaService.deck.create({ data: createDeckDto });
  }

  async findAll() {
    const decks = await this.prismaService.deck.findMany();

    return decks;
  }

  async findOne(id: string) {
    const deck = await this.prismaService.deck.findUnique({ where: { id } });
    return deck;
  }

  async update(id: string, updateDeckDto: UpdateDeckDto) {
    const updatedDeck = await this.prismaService.deck.update({
      where: { id },
      data: updateDeckDto,
    });

    return updatedDeck;
  }

  async delete(id: string) {
    await this.prismaService.deck.delete({ where: { id } });
  }
}
