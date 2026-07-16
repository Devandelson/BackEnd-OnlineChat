// Resource ===============================
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import mainRoute from './MainRoute.js';
import conex from './conex.js';

import { createServer } from 'http';
import { Server } from 'socket.io'

const mainServer = express();

// ---- config server -----------
// Middleware =================================
mainServer.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://front-chat-71nt.onrender.com'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
mainServer.use(express.json());
mainServer.use(cookieParser());

// config =================================
mainServer.set('port', process.env.PORT || 3000);

// main route ============================
mainServer.use('/api', mainRoute);

// Sockect config
const serverHttp = createServer(mainServer);

const socketEnv = new Server(serverHttp, {
    cors: {
        origin: ['http://localhost:5173', 'http://localhost:3000/'],
        credentials: true
    }
});

// enpoints socket
const activeUsers = new Map();

socketEnv.on('connection', (socket) => {
    const user = socket.handshake.auth.username;
    socket.user = user;
    activeUsers.set(socket.id, socket.user);

    socketEnv.emit('statUsers', Array.from(activeUsers.values()));

    socket.on('sendChat', (message) => {
        socketEnv.emit('channelChat', message);
    })

    socket.on('sendUpdateChat', (chat) => {
        socketEnv.emit('channelDeleteChat', chat);
    })

    socket.on('disconnect', () => {
        activeUsers.delete(socket.id);
        socketEnv.emit('sendUsers', Array.from(activeUsers.values()));
    });
});

serverHttp.listen(mainServer.get('port'), () => {
    console.log(`http://localhost:${mainServer.get('port')}/`);
});

// Conex
conex.connect().then(() => {
    console.log('Se ha conectado a al base de datos con exito!.');
}).catch((error) => {
    console.log('Muy mal revisa la cadena de conexión o configuración', error);
});