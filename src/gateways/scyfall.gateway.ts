import { BadRequestException, Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { writeFileSync } from 'fs';
import { UserFromRequest } from 'src/auth/auth.service';
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

  async getLeader(user: UserFromRequest, deckName: string, color: string) {
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

    cards.push({
      id: leader.id,
      name: leader.name,
      released_date: leader.released_at,
      mana_cost: leader.mana_cost,
      type: leader.type_line,
      text: leader.oracle_text,
      power: leader.power,
      toughness: leader.toughness,
      colors: leader.colors,
      cmc: leader.cmc,
      keywords: leader.keywords,
      rarity: leader.rarity,
      price_in_usd: leader.prices?.usd ?? 0,
      foil_price_in_usd: leader.prices?.usd_foil ?? 0,
    });

    const cardsResponse = await this.axios.get(
      `search?q=color=${colors}+-type:legendary&order=random`,
    );

    let x = 0;
    while (cards.length < 100 && x < cardsResponse.data.data.length) {
      const card = cardsResponse.data.data[x];

      if (card.name.includes('//')) {
        x++;
        continue;
      }

      if (
        card.type_line === 'Instant' ||
        card.type_line === 'Sorcery' ||
        card.type_line.includes('Enchantment') ||
        card.type_line.includes('Artifact')
      ) {
        cards.push({
          id: card.id,
          name: card.name,
          released_date: card.released_at,
          mana_cost: card.mana_cost,
          type: card.type_line,
          text: card.oracle_text,
          colors: card.colors,
          cmc: card.cmc,
          keywords: card.keywords,
          rarity: card.rarity,
          price_in_usd: card.prices?.usd ?? 0,
          foil_price_in_usd: card.prices?.usd_foil ?? 0,
        });
      } else {
        cards.push({
          id: card.id,
          name: card.name,
          released_date: card.released_at,
          mana_cost: card.mana_cost,
          type: card.type_line,
          text: card.oracle_text,
          power: card.power,
          toughness: card.toughness,
          colors: card.colors,
          cmc: card.cmc,
          keywords: card.keywords,
          rarity: card.rarity,
          price_in_usd: card.prices?.usd ?? 0,
          foil_price_in_usd: card.prices?.usd_foil ?? 0,
        });
      }
      x++;
    }

    const deck = await this.decksService.create({
      name: deckName,
      user_id: user.id,
    });

    const createdCardsPromises = cards.map((card) =>
      this.cardsService.create({
        id: card.id,
        name: card.name,
        released_date: new Date(card.released_date),
        mana_cost: card.mana_cost,
        type: card.type,
        text: card.text,
        power: card.power ? Number(card.power) : undefined,
        toughness: card.toughness ? Number(card.toughness) : undefined,
        colors: card.colors,
        cmc: card.cmc,
        rarity: card.rarity.toUpperCase(),
        price_in_usd: Number(card.price_in_usd),
        foil_price_in_usd: Number(card.foil_price_in_usd),
      }),
    );

    await Promise.all(createdCardsPromises);

    const createdCardsDataPromises = cards.map((card) =>
      this.cardDeckService.create({
        card_id: card.id,
        deck_id: deck.id,
      }),
    );

    await Promise.all(createdCardsDataPromises);

    writeFileSync('deck.json', JSON.stringify(cards, null, 2));
  }
}
