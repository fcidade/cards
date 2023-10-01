import { Server, Socket } from "socket.io";
import { getRoom } from ".";
import { Err, Nullable, Ok, Result } from "./types";
import { CardID } from "@fcidade/cah/build/card";
import { RoomID } from "@fcidade/cah/build/responses";
import { blackCards } from "@fcidade/cah/build/black-cards";
import { logfy } from "./logger";
import { RoomState } from "@fcidade/cah";

const log = logfy("choose black card");

export type ChooseBlackCardResponse = {};

export const chooseBlackCard = (
  socket: Socket,
  roomID: RoomID,
  nickname: string,
  cardID: CardID,
): Result<Nullable<ChooseBlackCardResponse>, Error> => {
  const room = getRoom(roomID);
  if (!room) {
    return Err(new Error(`invalid room id not found: ${roomID}`));
  }

  if (room.getState() !== RoomState.BlackChoosingCard) {
    return Err(
      new Error(
        `invalid room state, expected: ${RoomState.BlackChoosingCard}, got: ${room.getState()}`,
      ),
    );
  }

  const player = room.getPlayer(nickname);
  if (!player) {
    return Err(new Error(`invalid player not found: ${nickname}`));
  }

  // Muda status do player pra aguardando?
  const card = blackCards.find((c) => c.id === cardID);
  log(blackCards.find((c) => c.id.startsWith(cardID[0] + cardID[1])));
  if (!card) {
    return Err(new Error(`invalid card not found: ${cardID}`));
  }

  player.playBlackCard(room, card);
  room.setState(RoomState.WhiteChoosingCard);

  const cardsOnTheTable = room.getCardsAtTheTable();
  socket.to(roomID).emit("them:choose_black_card", {
    card,
    player,
    cards_on_the_table: cardsOnTheTable,
    room_state: room.getState(),
  });

  return Ok({
    my_black_cards: player.getBlackCards(),
    cards_on_the_table: cardsOnTheTable,
    room_state: room.getState(),
  });
};
