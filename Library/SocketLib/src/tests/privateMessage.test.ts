import { createServer } from "http";
import SocketService from "../socketService";
import { io as Client } from "socket.io-client";

jest.setTimeout(60000);

describe("SocketService Private Messages", () => {
  let ioServer: any;
  let httpServer: any;
  let httpServerAddr: any;
  let clientSocket1: any;
  let clientSocket2: any;

  beforeAll((done) => {
    httpServer = createServer();
    ioServer = new SocketService(httpServer);
    httpServer.listen(() => {
      httpServerAddr = httpServer.address();
      done();
    });
  });

  afterAll((done) => {
    ioServer.io.close();
    httpServer.close();
    done();
  });

  test("should handle private messages", (done) => {
    clientSocket1 = Client(`http://localhost:${httpServerAddr.port}`);
    clientSocket2 = Client(`http://localhost:${httpServerAddr.port}`);

    clientSocket1.on("connect", () => {
      clientSocket2.on("connect", () => {
        clientSocket2.on("privateMessage", ({ senderId, message }: any) => {
          try {
            expect(senderId).toBe(clientSocket1.id);
            expect(message).toBe("Hello from Client 1");
            done();
          } catch (error) {
            done(error);
          }
        });

        clientSocket1.emit("privateMessage", {
          recipientId: clientSocket2.id,
          message: "Hello from Client 1",
        });
      });
    });
  });
});
