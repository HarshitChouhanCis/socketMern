import React, { useMemo, useState } from 'react'
import { useEffect } from 'react';
import {io} from 'socket.io-client'
import { Box, Button, Container, Stack, TextField, Typography } from '@mui/material';
 
function App() {
  // const socket = io('http://localhost:3000');
  const socket = useMemo(()=>io('http://localhost:3000'),[])
 const[message,setMessage]=useState("")
 const[room,setRoom]=useState("")
 const[id,setId]=useState("")
 const[messages,setMessages]=useState([]);
const[roomName, setRoomName] = useState([])

 console.log('messages:', messages);


 const handleSubmit = (e) =>{
  e.preventDefault();
  socket.emit("message",{message,room})

  // console.log("message",message);
  setMessage("")
 }
 
 const joinRoomHandler = (e)=>{
  e.preventDefault();
  socket.emit('join-room',roomName)
  setRoomName("")
 }

  useEffect(()=>{
    socket.on("connect",()=>{

      console.log("connected",socket.id);
      setId(socket.id)
    })
    socket.on("welcome",(msg)=>{

      console.log("msg",msg);
    });
    socket.on("receive-message",(receive)=>{
      setMessages((messages)=>[...messages,receive])
      console.log("receive",receive);
    });
    return ()=>{
      socket.disconnect()
    }

  },[])

  return (
    <Container>
      <Box sx={{height:50}}/>
      <Typography variant='h5' component="div" gutterBottom>
        welcome to socket.io
      </Typography>
      <Typography variant='h5' component="div" gutterBottom>
       {id}
      </Typography>
      <form onSubmit={joinRoomHandler}>
        <h5>join room</h5>
        <TextField value={roomName} label="Room Name" onChange={e=>setRoomName(e.target.value)}></TextField>
        <Button variant='contained' color='primary' type="submit">Join Room</Button>
      </form>
      <form onSubmit={handleSubmit}><Typography>
        room
      </Typography>
      <TextField value={room} onChange={e=>setRoom(e.target.value)}></TextField>
      <TextField value={message} onChange={e=>setMessage(e.target.value)}></TextField>
       <Button variant='contained' color='primary' type="submit">  send</Button>
      </form>
      <Stack>
        {
          messages.map((m,i)=>(
            <Typography key={i} variant='h6' component="div" gutterBottom>
             {m}
            </Typography>
          ))
        }
      </Stack>
    </Container>)
}

export default App