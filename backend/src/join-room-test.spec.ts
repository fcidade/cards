import { getRoom } from ".";
import { joinRoom } from "./join-room";

// TODO:
// Remake ALL unit tests!

describe("join room", () => {
  it("should create room if it does not exist", () => {
    const roomIDMock = "i_do_not_exist";
    const nicknameMock = "city";

    expect(getRoom(roomIDMock)).toBeNull();
    joinRoom(roomIDMock, nicknameMock, "").throwOnErr();
    expect(getRoom(roomIDMock)).not.toBeNull();
  });

  it("should not recreate room if it already exists", () => {
    const roomIDMock = "i_exist";

    let room = () => getRoom(roomIDMock);
    expect(room()).toBeNull();

    joinRoom(roomIDMock, "city", "").throwOnErr();
    expect(room()).not.toBeNull();

    joinRoom(roomIDMock, "william", "").throwOnErr();
    expect(room()).toBe(room());
  });

  it("should add new player to the room", () => {
    const roomIDMock = "any_room";
    const nicknameMock = "city";

    joinRoom(roomIDMock, nicknameMock, "").throwOnErr();
    const room = getRoom(roomIDMock);
    expect(room?.getPlayers().map((p) => p.getNickname())).toContain(
      nicknameMock,
    );
  });

  it("should return an error if player is already in the room", () => {
    const roomIDMock = "already_in_the_room";
    const nicknameMock = "city";

    let result = joinRoom(roomIDMock, nicknameMock, "").throwOnErr();

    result = joinRoom(roomIDMock, nicknameMock, "");
    expect(result.err).toEqual(
      new Error(
        `a player with the nickname ${nicknameMock} is already in the room`,
      ),
    );
  });

  describe("should return a valid response", () => {
    const roomIDMock = "game_room_0";
    const nicknameMock = "william";
    const otherPlayersNicknames = [
      "braian",
      "city",
      "jp",
      "paulo",
      "reis",
    ];

    otherPlayersNicknames.forEach((name) =>
      joinRoom(roomIDMock, name, "").throwOnErr()
    );
    let { ok } = joinRoom(roomIDMock, nicknameMock, "").throwOnErr();

    it("basic user and room info", () => {
      expect(ok).toMatchObject(expect.objectContaining({
        round: 1,
        room_id: roomIDMock,
        my_nickname: nicknameMock,
        my_score: 0,
        amount_of_players_that_already_choosed: 0,
        amount_of_players_left_to_choose: 6,
        my_state: "choosing_card",
      }));
    });

    it("players and their scores", () => {
      expect(ok).toMatchObject(expect.objectContaining({
        players: [...otherPlayersNicknames, nicknameMock].map((name) => ({
          nickname: name,
          its_me: name === nicknameMock,
          score: 0,
        })),
      }));
    });

    it("current black card", () => {
      expect(ok?.black_card.content).toBeTruthy();
      expect(ok?.black_card.id).toBeTruthy();
      expect(ok?.black_card).toMatchObject({
        type: "black",
        is_hidden: false,
      });
    });

    it("current player cards", () => {
      ok?.my_cards.forEach((card) => {
        expect(card.content).toBeTruthy();
        expect(card.id).toBeTruthy();
        expect(card).toMatchObject({
          type: "white",
          is_hidden: false,
        });
      });
    });

    it("starts round with no white cards in the table", () => {
      expect(ok?.white_cards_on_the_table.length).toEqual(0);
    });
  });

  // Pretendo testar apenas no futuro
  // TODO: Testar se entrar no meio da partida
  // TODO: Testar oq acontece se acabarem as cartas (talvez só reiniciar o baralho e embaralhar)
  // TODO: Autenticar senha
});
