import { blackCards } from "./black-cards";
import { whiteCards } from "./white-cards";

export enum RoomState {
  /*Lobby*/
  Lobby = "lobby",
  /* =========== */
  /*BlackChoosingCard*/
  BlackChoosingCard = "black_choosing_card",
  /* =========== */
  /*WhiteChoosingCard*/
  WhiteChoosingCard = "white_choosing_card",
  /* =========== */
  /*BlackVoteCard*/
  BlackVoteCard = "black_vote_card",
  /* =========== */
  /*AnnounceRoundWinner*/
  AnnounceRoundWinner = "announce_round_winner",
  /* =========== */
}

export const fakeBlackCards = () => {
  return blackCards.slice(0, 5);
};

export const fakeWhiteCards = () => {
  return whiteCards.slice(0, 5);
};
