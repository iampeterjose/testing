const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    }
});

let cartItems = []; // In-memory storage

app.get('/cart', (req, res) => {
    res.json(cartItems);
});

// Listen for client connections
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Send current cart items to the newly connected client
    socket.emit('cart items', cartItems);

    // Handle checkout initiation
    socket.on('checkout', () => {
        io.emit('checkout initiated'); // Broadcast to all clients
    });
    // Handle cancel checkout
    socket.on('cancel checkout', () => {
        io.emit('cancel checkout initiated');
    });

    // Handle updating item quantities
    socket.on('update quantity', (data) => {
        const { id, quantity } = data;
        cartItems = cartItems.map(item =>
            item.id === id ? { ...item, quantity } : item
        ).filter(item => item.quantity > 0);
        io.emit('update cart', cartItems); // Notify all clients
    });

    // Handle adding items to the cart
    socket.on('add item', (item) => {
        const existingItemIndex = cartItems.findIndex(i => i.id === item.id);
        if (existingItemIndex >= 0) {
            cartItems[existingItemIndex].quantity += item.quantity;
        } else {
            cartItems.push(item);
        }
        io.emit('cart items', cartItems); // Notify all clients
    });

    // Handle clearing the cart
    socket.on('clear cart', () => {
        cartItems = [];
        io.emit('cart items', cartItems); // Notify all clients
    });

    // Handle client disconnection
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

server.listen(3001, () => {
    console.log('Server is running on port 3001');
});
