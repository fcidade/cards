import { getRoom, rooms } from ".";
import { logfy } from "./logger";
import { Player, SocketID } from "./player";
import { Room } from "./room";
import { Err, Nullable, Ok, Result } from "./types";
import {
  JoinRoomResponse,
  PlayerNickname,
  RoomID,
} from "@fcidade/cah/build/responses";

const log = logfy("join room");

export const joinRoom = (
  roomID: RoomID,
  nickname: PlayerNickname,
  socketID: SocketID,
): Result<Nullable<JoinRoomResponse>, Error> => {
  log("joining", roomID, nickname, socketID);
  let room = getRoom(roomID);
  if (!room) {
    room = new Room(roomID);
    rooms.push(room);
  }

  const player = new Player(nickname, socketID);
  player.takeWhiteCards(room.getWhiteDeck(), 5); // TODO: Constant or setting
  player.takeBlackCards(room.getBlackDeck(), 5); // TODO: Constant or setting

  const err = room.addPlayer(player);
  if (err) {
    return Err(err);
  }

  return Ok(mountPayload(room, player));
};

export const mountPayload = (room: Room, player: Player): JoinRoomResponse => ({
  room_id: room.getID(),
  room_state: room.getState(),
  my_nickname: player.getNickname(),
  my_score: player.getScore(),
  current_card_type: player.getCurrRoundCardType(),
  players: room.getPlayers().sort().map((p) => ({
    nickname: p.getNickname(),
    its_me: p.getNickname() === player.getNickname(),
    score: p.getScore(),
    current_card_type: p.getCurrRoundCardType(),
  })),
  my_white_cards: player.getWhiteCards(),
  my_black_cards: player.getBlackCards(),
  cards_on_the_table: room.getCardsAtTheTable(),
  round: room.getRound(),
  amount_of_players_left_to_choose: room.amountOfPlayersLeftToChoose(),
  amount_of_players_that_already_choosed: room.getCardsAtTheTable().length,
});
