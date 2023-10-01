import { RoomState } from ".";
import { Card, CardType } from "./card";
export type PlayerNickname = string;

export type RoomID = string;

export type JoinRoomResponse = {
  room_id: RoomID;
  round: number;
  room_state: RoomState;
  current_card_type: CardType;

  my_nickname: PlayerNickname;
  my_score: number;
  my_white_cards: Card[];
  my_black_cards: Card[];

  cards_on_the_table: Card[];

  players: Array<{
    nickname: PlayerNickname;
    its_me: boolean;
    score: number;
    current_card_type: CardType;
  }>;

  amount_of_players_that_already_choosed: number;
  amount_of_players_left_to_choose: number;
};
