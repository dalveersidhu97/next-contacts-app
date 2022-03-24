import { IncomingMessage, ServerResponse } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import {Server} from 'socket.io';

type SocketServer = {io: any}
type IO = {server: SocketServer}

type IOServer = IO & ServerResponse

const handler = (req: IncomingMessage, res: any) => {

    if(res.socket?.server.io)
        console.log('Socket already running.')
    else{
        console.log('Initializing socket..')
        const io = new Server(res.socket?.server);

        res.socket.server.io = io;

        io.on('connection', (socket)=>{
            socket.on('message', (msg)=>{
                socket.broadcast.emit('message-received', msg);
            })
            socket.on('message-delivered', (msg)=>{
                socket.broadcast.emit('message-delivered', msg);
            })
            socket.on('typing', (msg)=>{
                socket.broadcast.emit('typing');
            })
            socket.on('not-typing', (msg)=>{
                socket.broadcast.emit('not-typing');
            })
        });

    }
    res.end();
}

export default handler;