// server.js
const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer();
const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('A user connected');

    // Listen for cart updates from clients
    socket.on('cartUpdate', (data) => {
        console.log('Cart update received:', data);
        // Broadcast to all clients
        io.emit('cartUpdate', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(3000, () => {
    console.log('WebSocket server running on port 3000');
});
