import { Card, CardType } from "@fcidade/cah/build/card";
import { Deck } from "./deck";
import { Room } from "./room";
import { PlayerNickname } from "@fcidade/cah/build/responses";

export type SocketID = string;

export class Player {
  private whiteCards: Card[];
  private blackCards: Card[];

  private score: number;
  private currRoundCardType: CardType;

  constructor(
    private readonly nickname: PlayerNickname,
    private readonly socketID: SocketID,
  ) {
    this.whiteCards = [];
    this.blackCards = [];
    this.score = 0;
    this.currRoundCardType = "white";
  }

  getCurrRoundCardType(): CardType {
    return this.currRoundCardType;
  }
  setCurrRoundCardType(cardType: CardType) {
    this.currRoundCardType = cardType;
  }

  getSocketID(): SocketID {
    return this.socketID;
  }

  getScore(): number {
    return this.score;
  }

  getNickname(): PlayerNickname {
    return this.nickname;
  }

  takeWhiteCards(deck: Deck, amount: number) {
    this.whiteCards.push(...deck.take(amount));
  }

  takeBlackCards(deck: Deck, amount: number) {
    this.blackCards.push(...deck.take(amount));
  }

  getWhiteCards(): Card[] {
    return this.whiteCards;
  }

  getBlackCards(): Card[] {
    return this.blackCards;
  }

  playWhiteCard(room: Room, card: Card) {
    // TODO: Validate is state is valid
    room.placeCard(card);
    this.whiteCards = this.whiteCards.filter((c) => c.id !== card.id);
  }

  playBlackCard(room: Room, card: Card) {
    // TODO: Validate is state is valid
    room.placeCard(card);
    this.blackCards = this.blackCards.filter((c) => c.id !== card.id);
  }
}
