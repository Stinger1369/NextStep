class WebSocketService {
  private socket: WebSocket | null = null;
  private isConnected: boolean = false;
  private _isConnecting: boolean = false;
  private pendingMessages: string[] = [];

  /**
   * Connect to the WebSocket server.
   * @param url - The WebSocket server URL.
   * @param onMessage - Callback function to handle incoming messages.
   */
  connect(url: string, onMessage: (event: MessageEvent) => void) {
    if (this._isConnecting || this.isConnected) {
      console.log('WebSocket connection is already in progress or open.');
      return;
    }

    this._isConnecting = true;
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log('WebSocket connection established');
      this.isConnected = true;
      this._isConnecting = false;
      this.flushPendingMessages();
    };

    this.socket.onmessage = onMessage;

    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
      this.isConnected = false;
      this._isConnecting = false;
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.isConnected = false;
      this._isConnecting = false;
    };
  }

  /**
   * Send a message through the WebSocket.
   * If the WebSocket is not open, the message is added to the pending queue.
   * @param message - The message to send.
   */
  send(message: string) {
    if (this.isConnected) {
      this.socket?.send(message);
    } else {
      console.error('WebSocket is not open. Adding message to pending queue.');
      this.pendingMessages.push(message);
    }
  }

  /**
   * Send a message through the WebSocket when it is open.
   * If the WebSocket is not open, the message is added to the pending queue.
   * @param message - The message to send.
   */
  sendWhenOpen(message: string) {
    if (this.isConnected) {
      this.send(message);
    } else {
      this.pendingMessages.push(message);
    }
  }

  /**
   * Flush pending messages to the WebSocket server.
   * This method is called when the WebSocket connection is established.
   */
  private flushPendingMessages() {
    while (this.pendingMessages.length > 0 && this.isConnected) {
      const message = this.pendingMessages.shift();
      if (message && this.socket) {
        this.socket.send(message);
      }
    }
  }

  /**
   * Close the WebSocket connection.
   */
  close() {
    if (this.socket) {
      this.socket.close();
    }
  }

  /**
   * Check if the WebSocket is currently connected.
   * @returns True if connected, false otherwise.
   */
  isOpen(): boolean {
    return this.isConnected;
  }

  /**
   * Check if the WebSocket is currently connecting.
   * @returns True if connecting, false otherwise.
   */
  isConnecting(): boolean {
    return this._isConnecting;
  }
}

export const webSocketService = new WebSocketService();
