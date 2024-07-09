import { createServer } from "http";
import SocketService from "../socketService";
import { io as Client } from "socket.io-client";

jest.setTimeout(60000);

describe("SocketService Group Messages", () => {
  let ioServer: any;
  let httpServer: any;
  let httpServerAddr: any;
  let clientSocket: any;

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

  beforeEach((done) => {
    clientSocket = Client(`http://localhost:${httpServerAddr.port}`);
    clientSocket.on("connect", () => {
      done();
    });
  });

  afterEach((done) => {
    if (clientSocket.connected) {
      clientSocket.disconnect();
    }
    done();
  });

  test("should handle group messages", (done) => {
    clientSocket.on("groupMessage", (msg: string) => {
      try {
        expect(msg).toBe("Hello Group");
        done();
      } catch (error) {
        done(error);
      }
    });
    clientSocket.emit("groupMessage", "Hello Group");
  });
});
