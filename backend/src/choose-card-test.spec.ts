import { getRoom } from ".";
import { joinRoom } from "./join-room";

describe("choose card", () => {
  it("should create room if it does not exist", () => {
    //   // const roomIDMock = "i_do_not_exist";
    //   // const nicknameMock = "city";

    //   // expect(getRoom(roomIDMock)).toBeNull();
    //   // joinRoom(roomIDMock, nicknameMock).throwOnErr();
    //   // expect(getRoom(roomIDMock)).not.toBeNull();
  });
});

/*
Deck:
  - Puxar cartas sempre do mesmo deck, impedindo que 2 jogadores peguem a mesma carta
  - Definir quando e como chamar deck preto
  - Acabaram as cartas? (Tentar nunca checar neste cenário)
*/

/*
  Rounds:
    - Vou ver quantos jogadores ja jogaram
    - Vou ver quantos jogadores ainda não jogaram
    - Vou ver em que round estou
*/

/*
Etapa de escolher a carta para jogar:
// Vou escolher uma carta
// Vou jogar uma carta
// Vou esperar todos jogarem
*/

// Para quando tiver controle de rounds
// //  TODO: Round history

// IDEiA FORA: Colocar um text to speech para ler as cartas kkkk (https://github.com/IonicaBizau/text-to-speech-js)
// Caso não de para ler em tempo real, salvar os audios de cada carta em uma pasta e só tocar eles!
// Vou esperar ler a carta preta
// Vou esperar ler todas as cartas brancas
//      Uma carta irá virar e ser lida por vez
// Vou votar na carta que eu mais ri
// A carta que eu mesmo joguei, estará bloqueada.
// Vou esperar todos votarem
// Vou receber uma mensagem dizendo quem ganhou o round
// Caso eu ganhe, vou receber pontos
// Novo round inicia
// Recebo uma carta do baralho (os outros jogadores tbm)

// ----

// Frescurite:
// Ordenar jogadores por ordem de chegada
// Ordenar cartas por ordem de jogada
