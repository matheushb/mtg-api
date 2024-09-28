import { BadRequestException, Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { writeFileSync } from 'fs';
import { RequestUser } from 'src/auth/decorators/user-from-request.decorator';
import { transformCard } from 'src/common/transformers/card-transformer';
import { CardDeckService } from 'src/modules/card-deck/card-deck.service';
import { CardsService } from 'src/modules/cards/cards.service';
import { DecksService } from 'src/modules/deck/deck.service';

@Injectable()
export class ScyfallGateway {
  private axios: AxiosInstance;

  constructor(
    private readonly cardsService: CardsService,
    private readonly decksService: DecksService,
    private readonly cardDeckService: CardDeckService,
  ) {
    this.axios = axios.create({
      baseURL: 'https://api.scryfall.com/cards',
    });
  }

  async getLeader(user: RequestUser, deckName: string, col: string) {
    const color = col.toUpperCase();
    if (color && !/[WUBRG]/.test(color)) {
      throw new BadRequestException('Invalid color string, must be WUBRG');
    }

    const leaderResponse = await this.axios.get(
      `search?q=type:legendary+type:creature${
        color ? `+color=${color}` : ''
      }&order=random`,
    );

    const leader = leaderResponse.data.data[0];

    const colors = leader.colors.join('');
    const cards = [];

    cards.push(transformCard(leader));

    const cardsResponse = await this.axios.get(
      `search?q=color=${colors}+-type:legendary&order=random`,
    );

    const cardIds = cardsResponse.data.data.map((card) => card.id);
    const existingCards = await this.cardsService.findByIdBatch(cardIds);

    const existingCardsMap = new Map(
      existingCards.map((card) => [card.id, card]),
    );

    let x = 0;
    while (cards.length < 100 && x < cardsResponse.data.data.length) {
      const card = cardsResponse.data.data[x];

      if (card.name.includes('//')) {
        x++;
        continue;
      }

      const transformedCard = transformCard(card);
      let cardToSave = existingCardsMap.get(transformedCard.id);

      if (!cardToSave) {
        cardToSave = await this.cardsService.create(transformedCard);
      }

      cards.push(cardToSave);
      x++;
    }

    const deck = await this.decksService.create({
      name: deckName,
      user_id: user.id,
    });

    const createdCardsDataPromises = cards.map((card) =>
      this.cardDeckService.create({
        card_id: card.id,
        deck_id: deck.id,
      }),
    );

    await Promise.all(createdCardsDataPromises);

    writeFileSync('deck.json', JSON.stringify(cards, null, 2));
  }

  async importDeck(user: RequestUser, deckName: string, cards: any) {
    if (!cards || cards.length !== 100) {
      throw new BadRequestException('O deck deve conter 100 cartas.');
    }

    const commanderCard = cards.find((card) => card.rarity === 'MYTHIC');
    if (!commanderCard) {
      throw new BadRequestException(
        'O deck deve conter uma carta comandante (MYTHIC).',
      );
    }

    const deck = await this.decksService.create({
      name: deckName,
      user_id: user.id,
    });

    const existingCards = await this.cardsService.findByIdBatch(
      cards.map((card) => card.id),
    );
    const existingCardsMap = new Map(
      existingCards.map((card) => [card.id, card]),
    );

    const cardsToSave = await Promise.all(
      cards.map(async (transformedCard) => {
        let cardToSave = existingCardsMap.get(transformedCard.id);
        if (!cardToSave) {
          cardToSave = await this.cardsService.create(transformedCard);
        }
        return cardToSave;
      }),
    );

    const createdCardsDataPromises = cardsToSave.map((card) =>
      this.cardDeckService.create({
        card_id: card.id,
        deck_id: deck.id,
      }),
    );

    await Promise.all(createdCardsDataPromises);

    writeFileSync('imported-deck.json', JSON.stringify(cardsToSave, null, 2));
  }
}
