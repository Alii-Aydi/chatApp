import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors'

const app = express();

app.use(cors())

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT']
    }
});

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Joining a room
    socket.on('join-room', (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room ${room}`);
    });

    // Sending messages
    socket.on('send-message', ({ message, room }) => {
        if (room) {
            // socket.to(room).emit('receive-message', message);
            io.in(room).emit('receive-message', message);
        } else {
            socket.broadcast.emit('receive-message', message);
        }
    });

    // Private chat
    socket.on('send-private-message', ({ message, to }) => {
        socket.to(to).emit('receive-message', message);
    });

    // Connection status
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        io.emit('user-disconnected', socket.id);
    });
});

server.listen(3001, () => {
    console.log('Server listening on port 3001');
});
