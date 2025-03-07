import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const app = express();
const port = 3000;


const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true, // header pass krte hai wo and cookies pass kr te hai wo
  },
});

app.use(
  cors({
    origin: "http://localhost:5173/",
    methods: ["GET", "POST"],
    credentials: true, // header pass krte hai wo and cookies pass kr te hai wo
  })
);

app.get("/", (req, res) => {
  res.send("hello world");
});

app.get("/login", (req, res) => {
    const secretKeyJWT = "abcdefgh"
    const token = jwt.sign({_id: "qwwertyuiop"},secretKeyJWT)
    res.cookie("token", token, {httpOnly: true, secure:true , sameSite: "none"})
    .json({
        message: "Login Success",
    });

    // this login part is panding ok 30 is remaining
});

let user = true;
io.use((socket,next)=>{
  if(user) next();
});

io.on("connection", (socket) => {
  console.log("User Connected",socket.id);
  
  socket.on("message", (data)=>{
    console.log("data",data);
    // io.to(data.room).emit("receive-message",data.message);
    socket.to(data.room).emit("receive-message",data.message);
    // socket.broadcast.emit("receive-message",data);

  })
  socket.on('join-room',(room)=>{
    socket.join(room);

    console.log("user join new room ",socket.id);
})

//   console.log("id", socket.id);
  //   socket.emit("welcome",`welcome to server ${socket.id} emit`)
  //   socket.broadcast.emit("welcome",` ${socket.id} joined the server.broadcast`)
  socket.on("disconnect", () => {
    console.log("user Disconnected",socket.id);
  });
});



server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
