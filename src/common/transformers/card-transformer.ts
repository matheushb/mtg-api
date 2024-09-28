import { CreateCardDto } from 'src/modules/cards/dtos/create-card.dto';

export function transformCard(card: any): CreateCardDto {
  const baseCard = {
    id: card.id,
    name: card.name,
    released_date: card.released_date,
    mana_cost: card.mana_cost,
    type: card.type,
    text: card.text,
    colors: card.colors,
    cmc: card.cmc,
    rarity: card.rarity,
    price_in_usd: card.prices?.usd ?? 0,
    foil_price_in_usd: card.prices?.usd_foil ?? 0,
  };

  if (!card.power && !card.toughness) {
    return { ...baseCard };
  } else {
    return { ...baseCard, power: card.power, toughness: card.toughness };
  }
}
