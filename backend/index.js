
import express from "express";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import db from "./db.js";
import http from 'http';
import { Server }  from "socket.io"; 
import { viewTask } from "./controller/userController.js";

const app = express();

dotenv.config();

const __dirname = path.resolve(); 

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
    //   origin: 'http://localhost:3000', 
      origin: 'https://usermanagementecommerce-1.onrender.com', 
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });


app.io = io; 

io.on('connection', (socket) => {
    console.log('A user connected', socket.id);

    socket.on('join', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined`);
    });

    socket.on('viewTasks', async (userId) => {
        await viewTask(userId); 
    });
    
    socket.on('error', (err) => {
        console.error(`Socket error: ${err}`);
    });

    socket.on('disconnect', (reason) => {
        console.log(`A user disconnected - Reason: ${reason}`);
    });

    
});

const PORT = 8000; 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    // origin: "http://localhost:3000",
    origin: "https://usermanagementecommerce-1.onrender.com",
    credentials: true, 
  })
);

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                height: 100vh;
                margin: 0;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .container {
                background-color: rgba(255, 255, 255, 0.9);
                padding: 2rem;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                text-align: center;
            }
            h1 {
                color: #4a5568;
                margin-bottom: 1.5rem;
            }
            button {
                padding: 10px 20px;
                font-size: 16px;
                margin: 10px;
                cursor: pointer;
                border: none;
                border-radius: 5px;
                transition: all 0.3s ease;
            }
            button:first-of-type {
                background-color: #4299e1;
                color: white;
            }
            button:last-of-type {
                background-color: #48bb78;
                color: white;
            }
            button:hover {
                transform: translateY(-2px);
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Welcome to Our App</h1>
            <button onclick="location.href='/login'">Login</button>
            <button onclick="location.href='/register'">Register</button>
        </div>
    </body>
    </html>
  `);
});

app.use("/api/user", userRoute);

app.use(express.static(path.join(__dirname, "/frontend/build")))
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
});

server.listen(PORT, () => {
    db();
    console.log(`Server running at ${PORT}`);
});
