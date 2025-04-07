const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const path = require('path');

const app = express();

const cors = require('cors');
// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));
var whitelist = ['http://localhost:5173']
var corsOptions = {
  origin: function (origin, callback) {console.log(origin)
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.use(cors(corsOptions));
const server = http.createServer(app);
const io = socketio(server,{
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
    }
});
// Handle socket connections
io.on('connection', (socket) => {
    console.log('New user connected');
    
    // Welcome the new user
    socket.emit('message', 'Welcome to ChatApp!');
    
    // Broadcast when a user connects
    socket.broadcast.emit('message', 'A user has joined the chat');
    
    // Handle chat messages
    socket.on('chatMessage', (msg) => {
        io.emit('message', msg);
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left the chat');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));