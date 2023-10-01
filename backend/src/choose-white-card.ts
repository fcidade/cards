import { Server, Socket } from "socket.io";
import { getRoom } from ".";
import { Err, Nullable, Ok, Result } from "./types";
import { log } from "console";
import { CardID } from "@fcidade/cah/build/card";
import { whiteCards } from "@fcidade/cah/build/white-cards";
import { RoomID } from "@fcidade/cah/build/responses";
import { RoomState } from "@fcidade/cah";

export type ChooseWhiteCardResponse = {};

export const chooseWhiteCard = (
  socket: Socket,
  roomID: RoomID,
  nickname: string,
  cardID: CardID,
): Result<Nullable<ChooseWhiteCardResponse>, Error> => {
  const room = getRoom(roomID);
  if (!room) {
    return Err(new Error(`invalid room id not found: ${roomID}`));
  }

  // TODO: Impedir jogador de jogar duas vezes!!!!!

  if (room.getState() !== RoomState.WhiteChoosingCard) {
    return Err(
      new Error(
        `invalid room state, expected: ${RoomState.WhiteChoosingCard}, got: ${room.getState()}`,
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

  player.playWhiteCard(room, card);

  const cardsOnTheTable = room.getCardsAtTheTable();

  if (room.amountOfPlayersLeftToChoose() === 0) {
    room.setState(RoomState.BlackVoteCard);
  }

  socket.to(roomID).emit("them:choose_white_card", {
    card,
    player,
    cards_on_the_table: cardsOnTheTable,
    room_state: room.getState(),
  });

  return Ok({
    my_white_cards: player.getWhiteCards(),
    cards_on_the_table: cardsOnTheTable,
    room_state: room.getState(),
  });
};
