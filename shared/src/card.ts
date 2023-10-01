// TODO: Better ID generation
export const randID = (): string =>
  Math.random().toFixed(3).toString().replace(".", "");

export type CardType = "black" | "white";
export type CardID = string;

export type Card = {
  id: CardID;
  content: string;
  type: CardType;
  is_hidden: boolean;
};

export const card = (content: string): Card => ({
  id: randID(),
  content,
  type: "white",
  is_hidden: false,
});

export const hidden = (card: Card): Card => ({ ...card, is_hidden: true });

export const blackCard = (card: Card): Card => ({ ...card, type: "black" });
export const whiteCard = (card: Card): Card => ({ ...card, type: "white" });
