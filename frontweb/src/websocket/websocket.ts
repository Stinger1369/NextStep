class WebSocketService {
  private socket: WebSocket | null = null;
  private isConnected: boolean = false;
  private isConnecting: boolean = false;
  private pendingMessages: string[] = [];

  connect(url: string, onMessage: (event: MessageEvent) => void) {
    if (this.isConnecting || (this.socket && this.socket.readyState === WebSocket.OPEN)) {
      console.log('WebSocket connection is already in progress or open.');
      return;
    }

    this.isConnecting = true;
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log('WebSocket connection established');
      this.isConnected = true;
      this.isConnecting = false;
      this.flushPendingMessages();
    };

    this.socket.onmessage = onMessage;

    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
      this.isConnected = false;
      this.isConnecting = false;
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.isConnected = false;
      this.isConnecting = false;
    };
  }

  send(message: string) {
    if (this.isConnected) {
      this.socket?.send(message);
    } else {
      console.error('WebSocket is not open. Adding message to pending queue.');
      this.pendingMessages.push(message);
    }
  }

  sendWhenOpen(message: string) {
    if (this.isConnected) {
      this.send(message);
    } else {
      this.pendingMessages.push(message);
    }
  }

  private flushPendingMessages() {
    while (this.pendingMessages.length > 0 && this.isConnected) {
      const message = this.pendingMessages.shift();
      if (message && this.socket) {
        this.socket.send(message);
      }
    }
  }

  close() {
    if (this.socket) {
      this.socket.close();
    }
  }
}

export const webSocketService = new WebSocketService();
