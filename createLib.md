socket
mkdir -p Library/SocketLib/src
cd Library/SocketLib
npm init -y

npm install socket.io
npm install --save-dev typescript @types/node

import { Server } from 'socket.io';

class SocketService {
  private io: Server;

  constructor(server: any) {
    this.io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    this.io.on('connection', (socket) => {
      console.log('A user connected', socket.id);

      socket.on('disconnect', () => {
        console.log('User disconnected', socket.id);
      });

      // Ajoutez d'autres événements ici
      socket.on('message', (message) => {
        console.log('Received message:', message);
        this.io.emit('message', message);
      });
    });
  }

  public sendMessage(event: string, message: any) {
    this.io.emit(event, message);
  }
}

export default SocketService;

tsc



mkdir -p Library/NotifLib/src
cd Library/NotifLib
npm init -y

npm install nodemailer
npm install --save-dev typescript @types/node @types/nodemailer

src/index.ts :

import nodemailer from 'nodemailer';

class NotificationService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  public async sendEmail(to: string, subject: string, text: string) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}

export default NotificationService;

tsc

cd ../../backend
npm link ../Library/SocketLib
npm link ../Library/NotifLib


Utiliser la bibliothèque SocketLib dans votre projet principal :

backend/src/server.ts :
import express from 'express';
import http from 'http';
import SocketService from 'socket-lib';

const app = express();
const server = http.createServer(app);

// Initialiser le service socket.io
const socketService = new SocketService(server);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
