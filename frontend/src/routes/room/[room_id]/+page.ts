import { browser } from "$app/environment";

export const load = ({ params }): {
  nickname: string;
  debug: boolean;
  roomID: string;
} => {
  let debug = true;
  let nickname = (() => browser ? localStorage.getItem("nickname") : "")() ??
    "";

  const roomID = params.room_id ?? "";

  return {
    nickname,
    debug,
    roomID,
  };
};
