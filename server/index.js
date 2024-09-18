import express from 'express';
import http from 'http';
import { Server as socketIo } from 'socket.io'; // Correct import statement
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new socketIo(server, { // Correct instantiation with 'new'
  cors: {
    origin: "http://localhost:5173", // Adjust this to match your React app's URL
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

const users = new Set();
const socketToUser = new Map();

app.post("/register", (req, res) => {
  if (!req.body.name) return res.status(400).json({
    message: 'Name is Empty'
  });

  const userExists = Array.from(users).find(u => u === req.body.name);
  if (userExists) return res.status(400).json({
    message: 'User already exists'
  });

  users.add(req.body.name);

  io.emit("new user", req.body.name);
  return res.json({
    message: 'register success'
  });
});

app.get('/users', (req, res) => {
  res.json(Array.from(users));
});

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('register', (name) => {
    socketToUser.set(socket.id, name);
    socket.broadcast.emit('user_connected', name);
  });

  socket.on('send_message', (data) => {
    const { receiver, message } = data;
    const sender = socketToUser.get(socket.id);

    io.emit('receive_message', {
      sender,
      receiver,
      message
    });
  });

  socket.on('disconnect', () => {
    const name = socketToUser.get(socket.id);
    users.delete(name);
    socketToUser.delete(socket.id);
    socket.broadcast.emit('user_disconnected', name);
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 