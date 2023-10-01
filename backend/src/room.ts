import { Nullable } from "./types";
import { Player, SocketID } from "./player";
import { Deck } from "./deck";
import { randID } from "./helpers";
import { Card, hidden } from "@fcidade/cah/build/card";
import { RoomState } from "@fcidade/cah";
import { PlayerNickname, RoomID } from "@fcidade/cah/build/responses";

export class Room {
  private id: RoomID;
  private players: Record<PlayerNickname, Player>;
  private round: number;
  private state: RoomState;
  private blackDeck: Deck;
  private whiteDeck: Deck;
  private cardsAtTheTable: Card[];

  constructor(roomID?: RoomID) {
    this.round = 1;
    this.players = {};
    this.state = RoomState.Lobby;

    /* TODO: DEBUG */
    this.players["sou um mock"] = new Player("sou um mock", "aaaa");
    this.players["tbm sou um mock"] = new Player("tbm sou um mock", "aaaa");
    this.state = RoomState.BlackChoosingCard;
    this.getPlayers().forEach((p) => {
      p.setCurrRoundCardType("white");
    });
    /* TODO: DEBUG */

    this.id = roomID ?? randID();
    this.blackDeck = new Deck("black");
    this.blackDeck.shuffle();
    // TODO: Arrumar shuffle do baralho

    this.whiteDeck = new Deck("white");
    // this.whiteDeck.shuffle();
    this.cardsAtTheTable = [];
  }

  newRound() {
    this.setCardsAtTheTable([]);
  }

  setCardsAtTheTable(cards: Card[]) {
    // if (this.roomState === "choosing_card") {
    //   return this.cardsAtTheTable.map(hidden);
    // }
    this.cardsAtTheTable = cards;
  }

  getCardsAtTheTable(): Card[] {
    // if (this.roomState === "choosing_card") {
    //   return this.cardsAtTheTable.map(hidden);
    // }
    return this.cardsAtTheTable;
  }

  getWhiteDeck(): Deck {
    return this.whiteDeck;
  }

  getBlackDeck(): Deck {
    return this.blackDeck;
  }

  getRound(): number {
    return this.round;
  }

  getState(): RoomState {
    return this.state;
  }

  setState(newState: RoomState) {
    this.state = newState;
  }

  getID(): RoomID {
    return this.id;
  }

  getPlayers(): Player[] {
    return Object.values(this.players);
  }

  getPlayer(nickname: PlayerNickname): Nullable<Player> {
    return this.players[nickname] ?? null;
  }

  getPlayerBySocketID(socketID: SocketID): Nullable<Player> {
    return this.getPlayers().find((p) => p.getSocketID() === socketID) ?? null;
  }

  addPlayer(player: Player): Nullable<Error> {
    // if (this.getPlayer(player.getNickname())) {
    //   return new Error(
    //     `a player with the nickname ${player.getNickname()} is already in the room`,
    //   );
    // }
    /* TODO: DEBUG */
    this.players[player.getNickname()] = player;
    if (
      this.getState() === RoomState.BlackChoosingCard &&
      !this.getPlayers().find((p) => p.getCurrRoundCardType() === "black")
    ) {
      this.getPlayers().forEach((p) => p.setCurrRoundCardType("white"));
      player.setCurrRoundCardType("black");
    }
    /* TODO: DEBUG */

    return null;
  }

  placeCard(card: Card) {
    this.cardsAtTheTable.push(card);
    if (this.amountOfPlayersLeftToChoose() === 0) {
      Object.values(this.players).forEach((player) => {
        // TODO
      });
    }
  }

  removePlayer(nickname: string) {
    delete this.players[nickname];
  }

  amountOfPlayers(): number {
    return this.getPlayers().length;
  }

  amountOfPlayersLeftToChoose(): number {
    return this.amountOfPlayers() - this.getCardsAtTheTable().length;
  }
}
