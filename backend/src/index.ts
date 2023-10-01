import { Err, Nullable, Ok, Result } from "./types";
import { Room } from "./room";
import express, { json } from "express";
import { log } from "console";
import { Server } from "socket.io";
import { joinRoom } from "./join-room";
import { chooseWhiteCard } from "./choose-white-card";
import { voteBlackCard } from "./vote-black-card";

import { quitRoom } from "./quit-room";
import { SocketID } from "./player";
import { RoomID } from "@fcidade/cah/build/responses";
import { chooseBlackCard } from "./choose-black-card";

export const rooms: Room[] = [];

// Socket

export const getRoom = (roomID: RoomID): Nullable<Room> => {
  return rooms.find((r) => r.getID() === roomID) ?? null;
};

export const getRoomByPlayerSocketID = (socketID: SocketID): Nullable<Room> => {
  return rooms.find((r) => r.getPlayerBySocketID(socketID)) ?? null;
};

/* Express */

if (process.env.NODE_ENV !== "test") {
  const io = new Server({
    cors: {
      origin: "*",
    },
  });

  const PORT = Number(process.env.PORT) || 5000;

  io.on("connection", (socket) => {
    socket.on("action:join_room", ({ room_id, nickname }, callback) => {
      if (!room_id) {
        callback({ error: "room_id should not be empty" });
        return;
      }

      if (!nickname) {
        callback({ error: "nickname should not be empty" });
        return;
      }

      socket.join(room_id);

      const { ok, err } = joinRoom(room_id, nickname, socket.id);
      if (err) {
        callback({ error: err.message });
        return;
      }

      socket.broadcast.to(room_id).emit("them:join_room", {
        players: ok?.players,
      });
      callback(ok);
    });

    socket.on(
      "action:choose_black_card",
      ({ room_id, nickname, card_id }, callback) => {
        if (!room_id) {
          callback({ error: "room_id should not be empty" });
          return;
        }

        if (!nickname) {
          callback({ error: "nickname should not be empty" });
          return;
        }

        if (!card_id) {
          callback({ error: "card_id should not be empty" });
          return;
        }

        const { ok, err } = chooseBlackCard(
          socket,
          room_id,
          nickname,
          card_id,
        );
        if (err) {
          callback({ error: err.message });
          return;
        }
        callback(ok);
      },
    );

    socket.on(
      "action:choose_white_card",
      ({ room_id, nickname, card_id }, callback) => {
        if (!room_id) {
          callback({ error: "room_id should not be empty" });
          return;
        }

        if (!nickname) {
          callback({ error: "nickname should not be empty" });
          return;
        }

        if (!card_id) {
          callback({ error: "card_id should not be empty" });
          return;
        }

        const { ok, err } = chooseWhiteCard(
          socket,
          room_id,
          nickname,
          card_id,
        );
        if (err) {
          callback({ error: err.message });
          return;
        }
        callback(ok);
      },
    );

    socket.on(
      "action:black_vote_card",
      ({ room_id, nickname, card_id }, callback) => {
        if (!room_id) {
          callback({ error: "room_id should not be empty" });
          return;
        }

        if (!nickname) {
          callback({ error: "nickname should not be empty" });
          return;
        }

        if (!card_id) {
          callback({ error: "card_id should not be empty" });
          return;
        }

        const { ok, err } = voteBlackCard(
          socket,
          room_id,
          nickname,
          card_id,
        );
        if (err) {
          callback({ error: err.message });
          return;
        }
        callback(ok);
      },
    );

    socket.on("disconnect", () => {
      const { room } = quitRoom(socket.id).throwOnErr().ok!;
      if (!room) {
        return;
      }

      socket.broadcast.to(room?.getID()).emit("them:quit_room", {
        players: room?.getPlayers(),
      });
    });
  });

  io.listen(PORT);
  log("WebSocket listening on port", PORT);

  // const app = express();
  // app.use(express.json());
  // app.use(express.urlencoded({ extended: true }));

  // app.post("/v1/join_room/:id", (req, res) => {
  //   const { id } = req.params;
  //   const { nickname } = req.body;
  //   log(req.body);

  //   if (!nickname) {
  //     return res.status(400).json({ error: "nickname should not be empty" });
  //   }

  //   const { ok, err } = joinRoom(id, nickname);
  //   if (err) {
  //     // TODO: Better error status and etc...
  //     return res.status(500).json({ error: err.message });
  //   }

  //   return res.json(ok);
  // });

  // app.listen(PORT, () => {
  //   log(`Server running on port ${PORT}...`);
  // });
}
