import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket;
  private socketUrl = 'ws://localhost:5001'; // Replace with your WebSocket server URL

  constructor() {
    this.socket = webSocket(this.socketUrl);
  }

  sendMessage(message: any): void {
    this.socket.next(message);
  }

  getMessages(): Observable<any> {
    return this.socket;
  }

  closeConnection(): void {
    this.socket.complete(); // Close the WebSocket connection
  }
}
