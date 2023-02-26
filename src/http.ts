import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';


const app = express();

app.use(cors());

// app.use(express.static(path.join(__dirname, '..',  'public')));

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin:'*',  //['http://localhost:5173', 'http://192.168.0.101:5173'],
        // methods: ['GET', 'POST']
    }
});


export { app, server, io }