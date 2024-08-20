import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { writeFileSync } from 'fs';

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

    const leader = await leaderResponse.data.data[
      Math.ceil(Math.random() * 20)
    ];

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
      price_in_usd: leader.prices.usd ?? 0,
      foil_price_in_usd: leader.prices.usd_foil ?? 0,
    });

    const cardsResponse = await this.axios.get(
      `search?q=color=${colors}+-type:legendary&order=random`,
    );

    let x = 0;
    while (cards.length < 100 && x++ <= cardsResponse.data.data.length) {
      const card = cardsResponse.data.data[x];

      if (card.name.includes('//')) continue;

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
          price_in_usd: card.prices.usd ?? 0,
          foil_price_in_usd: card.prices.usd_foil ?? 0,
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
          price_in_usd: card.prices.usd ?? 0,
          foil_price_in_usd: card.prices.usd_foil ?? 0,
        });
      }
    }

    console.log(cards);
    writeFileSync('deck.json', JSON.stringify(cards, null, 2));
    console.log(cards.length);
    console.log(leader);
  }
}
