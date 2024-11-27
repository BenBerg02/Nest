import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';


@WebSocketGateway({cors: true})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() wss: Server

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    this.chatService.registerClient(client)

    this.wss.emit('clients-updated', this.chatService.getConnectedClient())
  }

  handleDisconnect(client: Socket) {
    this.chatService.removeClient(client.id)
  }

  
}
