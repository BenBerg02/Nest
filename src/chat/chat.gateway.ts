import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/users/interfaces/jwt-payload.interface';
import { messageDto } from './dto/message.dto';


@WebSocketGateway({cors: true})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() wss: Server

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService
  ) {}

  async handleConnection(client: Socket) {

    const token = client.handshake.headers.authentication as string
    let payload: JwtPayload

    try {
      
      payload = this.jwtService.verify(token)
      await this.chatService.registerClient(client, payload.id)

    } catch (error) {
      client.disconnect()
      return
    }

    this.wss.emit('clients-updated', this.chatService.getConnectedClient())
  }

  handleDisconnect(client: Socket) {
    this.chatService.removeClient(client.id)
    this.wss.emit('clients-updated', this.chatService.getConnectedClient())
  }

  @SubscribeMessage('message-from-client')
  async onMessageFromClient(client: Socket, payload: messageDto){

    let jwtpayload: JwtPayload
    
    const token = client.handshake.headers.authentication as string
    jwtpayload = this.jwtService.verify(token)

    const fullName = await this.chatService.getUserName(jwtpayload.id)
    this.wss.emit('message-from-server', {fullName, message: payload.message})
  }

  
}
