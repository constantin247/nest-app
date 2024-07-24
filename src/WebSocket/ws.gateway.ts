// import { StackContext, WebSocketApi } from "sst/constructs";

// export function onNewConnection({ stack }: StackContext) {
//     console.log('New User Connection');

//     const socket = new WebSocketApi(stack, 'API',
//         {
//             routes: {
//                 $connect: "src/connect.main",
//                 $disconnect: "src/disconnect.main",
//                 onMessage: "src/sendMessage.main",
//             }
//         }
//     );

//     stack.addOutputs({
//         ApiEndPoint: socket.url,
//     });
// }


import { OnModuleInit } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { WSService } from "./ws.service";

@WebSocketGateway()
export class WSGateway implements OnModuleInit {
    socketId?: string;

    constructor(protected readonly service: WSService) { }

    @WebSocketServer()
    server: Server | undefined;

    onModuleInit() {
        this.server?.on('connection', (socket) => {
            this.socketId = socket.id;
            console.log('New User Connection', socket.id);
        });
    }

    @SubscribeMessage('user_message')
    async onNewMessage(@MessageBody() body: any) {

        const response = await this.service.ChatClient(body.message);


        this.server?.emit('onmessage', {
            message: response.message,
            body: response.buffer
        })
    }
};
