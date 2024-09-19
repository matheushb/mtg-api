import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateDeckDto } from './dtos/create-deck.dto';
import { UpdateDeckDto } from './dtos/update-deck.dto';

@Injectable()
export class DecksRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(createDeckDto: CreateDeckDto) {
    return this.prismaService.deck.create({ data: createDeckDto });
  }

  findAll(filter: Prisma.DeckWhereInput) {
    const decks = this.prismaService.deck.findMany({
      where: { AND: [filter] },
    });

    return decks;
  }

  findOne(id: string) {
    const deck = this.prismaService.deck.findUnique({ where: { id } });
    return deck;
  }

  update(id: string, updateDeckDto: UpdateDeckDto) {
    const updatedDeck = this.prismaService.deck.update({
      where: { id },
      data: updateDeckDto,
    });

    return updatedDeck;
  }

  delete(id: string) {
    this.prismaService.deck.delete({ where: { id } });
  }
}
