import { io, type Socket } from "socket.io-client";
import type { JoinRoomResponse } from "@fcidade/cah/build/responses";
import type { CardID } from "@fcidade/cah/build/card";

// export const emitChooseCard = (
//   roomID: string,
//   nickname: string,
//   cardID: string,
// ) => {
//   socket?.emit(
//     "action:choose_card",
//     {
//       nickname,
//       room_id: roomID,
//       card_id: cardID,
//     },
//     console.log,
//   );
// };

// export const emitJoinRoom = (
//   roomID: string,
//   nickname: string,
//   callback: (data: any) => void, // TODO: Add types
// ) => {
//   socket.emit(
//     "action:join_room",
//     {
//       room_id: roomID,
//       nickname,
//     },
//     callback,
//   );
// };

const emit = async <T>(
  socket: Socket,
  event: string,
  params: any,
): Promise<T> => {
  return new Promise((res, rej) => {
    socket.emit(
      event,
      params,
      (response: any) => {
        console.log({ response });
        if (response.error) {
          console.error(response.error);
          rej(response.error);
        } else {
          res(response);
        }
      },
    );
  });
};

const on = (socket: Socket, event: string, callback: (data: any) => void) => {
  socket.on(
    event,
    callback,
  );
};

export class CAHClient {
  private static instance: CAHClient;

  static get(): CAHClient {
    if (!CAHClient.instance) {
      const socket = io("http://localhost:5000");
      CAHClient.instance = new CAHClient(socket);
    }
    return CAHClient.instance;
  }

  constructor(private readonly socket: Socket) {}

  async joinRoom(
    roomID: string,
    nickname: string,
  ): Promise<JoinRoomResponse> {
    return await emit(this.socket, "action:join_room", {
      room_id: roomID,
      nickname,
    });
  }

  onThemJoinOrQuitRoom(callback: (data: any) => void) {
    on(this.socket, "them:join_room", callback);
    on(this.socket, "them:quit_room", callback);
    return;
  }

  onThemChooseCard(callback: (data: any) => void) {
    on(this.socket, "them:choose_black_card", callback);
    on(this.socket, "them:choose_white_card", callback);
    return;
  }

  async blackChooseCard(
    roomID: string,
    nickname: string,
    cardID: CardID,
  ): Promise<any> {
    return await emit(this.socket, "action:choose_black_card", {
      room_id: roomID,
      nickname,
      card_id: cardID,
    });
  }

  async whiteChooseCard(
    roomID: string,
    nickname: string,
    cardID: CardID,
  ): Promise<any> {
    return await emit(this.socket, "action:choose_white_card", {
      room_id: roomID,
      nickname,
      card_id: cardID,
    });
  }

  async blackVoteCard(
    roomID: string,
    nickname: string,
    cardID: CardID,
  ): Promise<any> {
    return await emit(this.socket, "action:black_vote_card", {
      room_id: roomID,
      nickname,
      card_id: cardID,
    });
  }
}
