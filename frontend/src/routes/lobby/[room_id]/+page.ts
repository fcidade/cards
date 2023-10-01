import { browser } from "$app/environment";

export const load = ({ params }) => {
  let nickname = (() => browser ? localStorage.getItem("nickname") : "")() ??
    "";
  return {
    roomID: params.room_id,
    nickname: nickname,
  };
};
