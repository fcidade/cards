import { Socket } from "socket.io";
import { getRoom } from ".";
import { Err, Nullable, Ok, Result } from "./types";
import { CardID, whiteCard } from "@fcidade/cah/build/card";
import { RoomID } from "@fcidade/cah/build/responses";
import { logfy } from "./logger";
import { RoomState } from "@fcidade/cah";
import { whiteCards } from "@fcidade/cah/build/white-cards";

const log = logfy("vote black card");

export type VoteBlackCardResponse = {};

export const voteBlackCard = (
  socket: Socket,
  roomID: RoomID,
  nickname: string,
  cardID: CardID,
): Result<Nullable<VoteBlackCardResponse>, Error> => {
  const room = getRoom(roomID);
  if (!room) {
    return Err(new Error(`invalid room id not found: ${roomID}`));
  }

  if (room.getState() !== RoomState.BlackVoteCard) {
    return Err(
      new Error(
        `invalid room state, expected: ${RoomState.BlackVoteCard}, got: ${room.getState()}`,
      ),
    );
  }

  const player = room.getPlayer(nickname);
  if (!player) {
    return Err(new Error(`invalid player not found: ${nickname}`));
  }

  // Muda status do player pra aguardando?
  const card = whiteCards.find((c) => c.id === cardID);
  log(whiteCards.find((c) => c.id.startsWith(cardID[0] + cardID[1])));
  if (!card) {
    return Err(new Error(`invalid card not found: ${cardID}`));
  }

  room.setState(RoomState.AnnounceRoundWinner);
  room.setCardsAtTheTable([card]);

  const cardsOnTheTable = room.getCardsAtTheTable();
  socket.to(roomID).emit("them:vote_black_card", {
    card,
    player,
    cards_on_the_table: cardsOnTheTable,
    room_state: room.getState(),
  });

  setTimeout(() => {
    room.newRound();
    // TODO: all fields
    const cardsOnTheTable = room.getCardsAtTheTable();
    socket.to(roomID).emit("room:next_round", {
      cards_on_the_table: cardsOnTheTable,
      room_state: room.getState(),
    });
  }, 2000);

  return Ok({
    cards_on_the_table: cardsOnTheTable,
    room_state: room.getState(),
  });
};
