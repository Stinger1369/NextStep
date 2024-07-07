// websocket.ts
class WebSocketService {
  private socket: WebSocket | null = null;
  private isConnected: boolean = false;
  private pendingMessages: string[] = [];

  connect(url: string, onMessage: (event: MessageEvent) => void) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      this.socket = new WebSocket(url);
      this.socket.onopen = () => {
        console.log('WebSocket connection established');
        this.isConnected = true;
        this.flushPendingMessages();
      };
      this.socket.onmessage = onMessage;
      this.socket.onclose = () => {
        console.log('WebSocket connection closed');
        this.isConnected = false;
      };
      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    }
  }

  send(message: string) {
    if (this.isConnected) {
      this.socket?.send(message);
    } else {
      console.error('WebSocket is not open. Adding message to pending queue.');
      this.pendingMessages.push(message);
    }
  }

  private flushPendingMessages() {
    while (this.pendingMessages.length > 0) {
      const message = this.pendingMessages.shift();
      this.socket?.send(message!);
    }
  }

  close() {
    if (this.socket) {
      this.socket.close();
    }
  }
}

export const webSocketService = new WebSocketService();
