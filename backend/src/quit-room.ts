import { getRoom, getRoomByPlayerSocketID, rooms } from ".";
import { logfy } from "./logger";
import { Player, SocketID } from "./player";
import { Room } from "./room";
import { Err, Nullable, Ok, Result } from "./types";

export type QuitRoomResponse = {
  room: Nullable<Room>;
};

const log = logfy("quit room");

export const quitRoom = (
  socketID: SocketID,
): Result<Nullable<QuitRoomResponse>, Error> => {
  log("Removing socketID: ", socketID);

  const room = getRoomByPlayerSocketID(socketID);
  if (!room) {
    log("room not found");
    return Ok({ room });
  }

  const player = room?.getPlayerBySocketID(socketID);
  if (!player) {
    log("player not found");
    return Ok({ room });
  }

  const err = room?.removePlayer(player?.getNickname()!);
  // if (err) { // TODO
  //   return Err(err);
  // }

  return Ok({ room });
};
