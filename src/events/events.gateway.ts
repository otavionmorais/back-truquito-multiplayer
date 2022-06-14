import { OnModuleInit } from '@nestjs/common';
import {
    WebSocketGateway,
    WebSocketServer,
  } from '@nestjs/websockets';
  import { Server } from 'socket.io';
  
  @WebSocketGateway({
    cors: {
      origin: '*',
    },
    pingInterval: 5000
  })
  export class EventsGateway implements OnModuleInit {

    private clients: Record<string, boolean>;
    
    @WebSocketServer()
    server: Server;

    onModuleInit() {
      this.clients = {};

      this.server.on('connect', (client) => {
        this.clients[client.id] = true;
        console.log(this.clients);
      });

      this.server.on('connection', (client) => {
        client.on('disconnect', () => {
          delete this.clients[client.id];
          console.log(this.clients);
        });
      });
    }
  
  }
  