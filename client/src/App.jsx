
import React, { useEffect, useMemo, useState } from 'react';
import { io } from "socket.io-client";
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

const App = () => {
  const socket = useMemo(
    () =>
      io("http://localhost:3000", {
        withCredentials: true,
      }),
    []
  );

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [room, setRoom] = useState("");
  const [roomName, setRoomName] = useState("");
  const [socketID, setsocketID] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(text)
    socket.emit("message", { message:text, room });
    setText("");
  };
  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  };
  useEffect(() => {

    socket.on("connect", () => {
      setsocketID(socket.id)
      console.log("connected", socket.id);
    });

    socket.on("welcome", (s) => {
      console.log(s);
    });

    socket.on("receive-message", (data) => {
      console.log(data);
      setMessages((messages) => [...messages, data]);
    })

    return () => {
      socket.disconnect();
    };

  }, [])

  return (
    <Container>
      <Typography>
        welcome to socket.io
      </Typography>
      <Typography>
        {socketID}
      </Typography>
      <form onSubmit={joinRoomHandler}>
      <TextField
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}

          label="Room  Name"
          variant="outlined"
        />
        <Button type='submit' variant="contained">jOIN</Button>

      </form>
      <form>
        <TextField
          value={text}
          onChange={(e) => setText(e.target.value)}

          label="text"
          variant="outlined"
        />

        <TextField
          value={room}
          onChange={(e) => setRoom(e.target.value)}

          label="room"
          variant="outlined" />
        <Button onClick={handleSubmit} variant="contained">submit</Button>
      </form>
      <Stack>
        {messages?.map((m, i) => (
          <Typography key={i} variant="h6" component="div" gutterBottom>
            {m}
          </Typography>
        ))}
      </Stack>
    </Container>
  )
}

export default App
