import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

interface ConnectedClients{
    [id: string]: {client: Socket, user: User}
}

@Injectable()
export class ChatService {
    private connectedClients: ConnectedClients = {}

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ){}
 
    async registerClient(client: Socket, id: string){
        const user = await this.userRepository.findOneBy({id})
        if(!user) throw new Error('not Found')
        if(!user.isActive) throw new Error('not active user')
        
        await this.checkStatus(user) 

        
        this.connectedClients[client.id] = {client, user}
    
    }
    removeClient(id: string){
        delete this.connectedClients[id]
    }

    getConnectedClient(): string[]{
        let result: string[] = []
        for(const client of Object.keys(this.connectedClients)){
            const connectedClient = this.connectedClients[client]
            result.push(connectedClient.user.fullname)
        }

        return result
    }

    async getUserName(id: string){
        const { fullname } = await this.userRepository.findOneBy({id})
        return fullname
    }

    private checkStatus(user: User){
        for (const clientID of Object.keys(this.connectedClients)) {
            const connectedClients = this.connectedClients[clientID]

            if(connectedClients.user.id === user.id){
                connectedClients.client.disconnect(); 
                break;
            }
            
        }
    }
}
