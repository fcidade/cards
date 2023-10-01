import { goto } from "$app/navigation";
import { RoomState } from "@fcidade/cah";
import { CAHClient } from "../lib/client";
import {
  cardsOnTheTable,
  currentCardType,
  myBlackCards,
  myWhiteCards,
  players,
  roomState,
  type TempPlayer,
} from "../store/player";
import type { CardID } from "@fcidade/cah/build/card";

export const joinRoom = async (
  roomID: string,
  nickname: string,
) => {
  localStorage.setItem("nickname", nickname);
  localStorage.setItem("room", roomID);

  const data = await CAHClient.get().joinRoom(roomID, nickname);
  const { room_state } = data;

  players.set(data.players as unknown as TempPlayer[]); // TODO
  roomState.set(data.room_state);
  myWhiteCards.set(data.my_white_cards);
  myBlackCards.set(data.my_black_cards);
  cardsOnTheTable.set(data.cards_on_the_table);
  currentCardType.set(data.current_card_type);

  if (!room_state) {
    throw new Error("room_state should not be undefined!");
  }

  if (room_state === RoomState.Lobby) {
    goto("/lobby/" + roomID);
  } else {
    goto("/room/" + roomID);
  }
};

export const onThemJoinRoom = async () => {
  CAHClient.get().onThemJoinOrQuitRoom((data) => {
    players.set(data.players);
    console.log(data);
  });
};

export const blackChooseCard = async (
  roomID: string,
  nickname: string,
  cardID: CardID,
) => {
  const data = await CAHClient.get().blackChooseCard(roomID, nickname, cardID);
  myBlackCards.set(data.my_black_cards);
  cardsOnTheTable.set(data.cards_on_the_table);
  roomState.set(data.room_state);
};

export const onThemChooseCard = async () => {
  CAHClient.get().onThemChooseCard((data) => {
    roomState.set(data.room_state);
    cardsOnTheTable.set(data.cards_on_the_table);
  });
};

export const whiteChooseCard = async (
  roomID: string,
  nickname: string,
  cardID: CardID,
) => {
  const data = await CAHClient.get().whiteChooseCard(roomID, nickname, cardID);
  myWhiteCards.set(data.my_white_cards);
  cardsOnTheTable.set(data.cards_on_the_table);
  roomState.set(data.room_state);
};

export const blackVoteCard = async (
  roomID: string,
  nickname: string,
  cardID: CardID,
) => {
  const data = await CAHClient.get().blackVoteCard(roomID, nickname, cardID);
  myBlackCards.set(data.my_black_cards);
  cardsOnTheTable.set(data.cards_on_the_table);
  roomState.set(data.room_state);
};
