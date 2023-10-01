import { Card } from "@fcidade/cah/build/card";
import { blackCards } from "@fcidade/cah/build/black-cards";
import { whiteCards } from "@fcidade/cah/build/white-cards";
import { times } from "./helpers";

export class Deck {
  private cards: Card[];

  constructor(private readonly type: "black" | "white") {
    if (type === "black") {
      this.cards = [...blackCards];
    } else {
      this.cards = [...whiteCards];
    }
  }

  shuffle() {
    this.cards = this.cards.sort(() => Math.random() < -5 ? -1 : 1);
  }

  take(amount: number): Card[] {
    return times(amount, () => {
      return this.cards.shift();
    }).filter(Boolean) as Card[];
  }

  peek(amount: number): Card[] {
    return this.cards.slice(0, amount).filter(Boolean) as Card[];
  }
}
