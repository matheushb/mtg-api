import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { appendFileSync } from 'fs';

@Injectable()
export class ScyfallGateway {
  private axios: AxiosInstance;

  constructor() {
    this.axios = axios.create({
      baseURL: 'https://api.scryfall.com/cards',
    });
  }

  async getLeader() {
    const leaderResponse = await this.axios.get(
      'search?q=type:legendary+type:creature&order=random',
    );

    const leader = await leaderResponse.data.data[0];

    const colors = leader.colors.join('');

    const cardsResponse = await this.axios.get(
      `search?q=color=${colors}+-type:legendary&order=random&limit=99`,
    );

    const cards = await cardsResponse.data.data.slice(0, 99).map((card) => {
      console.log(card);

      const parsedCart = {
        id: card.id,
        name: card.name,
        released_date: card.released_at,
        mana_cost: card.mana_cost,
        type: card.type_line,
        text: card.oracle_text,
        power: card.type_line in ['Instant', 'Sorcery'] ? card.power : 0,
        toughness:
          card.type_line in ['Instant', 'Sorcery'] ? card.toughness : 0,
        colors: card.colors,
        cmc: card.cmc,
        keywords: card.keywords,
        rarity: card.rarity,
        price_in_usd: card.prices.usd ?? 0,
        foil_price_in_usd: card.prices.usd_foil ?? 0,
      };
      console.log(parsedCart);
      return parsedCart;
    });
  }
}
