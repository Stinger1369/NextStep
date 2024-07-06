class WebSocketService {
  private socket: WebSocket | null = null;

  connect(url: string, onMessage: (event: MessageEvent) => void) {
    this.socket = new WebSocket(url);
    this.socket.onopen = () => {
      console.log('WebSocket connection established');
    };
    this.socket.onmessage = onMessage;
    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
    };
    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  send(message: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.error('WebSocket is not open');
    }
  }

  close() {
    if (this.socket) {
      this.socket.close();
    }
  }
}

export const webSocketService = new WebSocketService();
