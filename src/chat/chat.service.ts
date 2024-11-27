import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

interface ConnectedClients{
    [id: string]: Socket
}

@Injectable()
export class ChatService {
    private connectedClients: ConnectedClients = {}

    registerClient(client: Socket){
        this.connectedClients[client.id] = client
        console.log(this.connectedClients)
    }
    removeClient(id: string){
        delete this.connectedClients[id]
    }

    getConnectedClient(): string[]{
        return Object.keys(this.connectedClients)
    }
}
