import { RoomState } from "@fcidade/cah";
import type { Card, CardType } from "@fcidade/cah/build/card";
import type { PlayerNickname } from "@fcidade/cah/build/responses";
import { writable } from "svelte/store";

//TODO TEMP
export type TempPlayer = {
  nickname: PlayerNickname;
  score?: 0; // TODO
  its_me?: false; // TODO
};

export const players = writable<TempPlayer[]>([]);

export const roomState = writable<RoomState>(RoomState.Lobby);

export const myWhiteCards = writable<Card[]>([]);
export const myBlackCards = writable<Card[]>([]);
export const cardsOnTheTable = writable<Card[]>([]);

export const currentCardType = writable<CardType>("white");
