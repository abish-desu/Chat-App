"use client";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

export default function Home() {
  const [showRoomInput, setShowRoomInput] = useState(true);
  const [showMsg, setShowMsg] = useState(false);
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [room, setRoom] = useState("");
  const [roomPin, setRoomPin] = useState("");

  const sendMsg = () => {
    socket.emit("send_msg", { room, msg });
    setMessages((prevMessages) => [...prevMessages, `You: ${msg}`]);
    setMsg("");
  };

  useEffect(() => {
    socket.on("no_room_found", (room) => {
      alert(`No rooms for ${room}`);
    });
    socket.on("room_already_exist", (roomPin) => {
      alert(`room ${roomPin} already exist`);
    });
    socket.on("joined_room", (room) => {
      setShowRoomInput(false);
      setShowMsg(true);
      alert(`joined room ${room}`);
    });
    socket.on("created_room", (roomPin) => {
      setShowRoomInput(false);
      setShowMsg(true);
      setRoom(roomPin);
      alert(`created room  ${roomPin}`);
    });

    socket.on("receive_msg", (data: { room: string; message: string }) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        `Received : ${data.message}`,
      ]);
    });
  }, []);

  const joinRoom = () => {
    console.log(room);
    socket.emit("join_room", room);
  };
  const createRoom = () => {
    console.log(roomPin);
    socket.emit("create_room", roomPin);
  };

  return (
    <div className="flex flex-col items-center  mt-4">
      {showRoomInput && (
        <div>
          {/* Join room */}
          <div>
            <input
              className="outline-none border border-black p-2 mb-4 rounded-3xl bg-transparent w-[400px] text-black pl-4 pr-4"
              placeholder="Room"
              value={room}
              onChange={(event) => setRoom(event.target.value)}
            />
            <button
              onClick={joinRoom}
              className="outline-none border border-black p-2 mb-4 rounded-3xl bg-transparent ml-2 text-black px-9"
            >
              Join Room
            </button>
          </div>
          {/* create room*/}
          <div>
            <input
              className="outline-none border border-black p-2 mb-4 rounded-3xl bg-transparent w-[400px] text-black pl-4 pr-4"
              placeholder="create room"
              value={roomPin}
              onChange={(event) => setRoomPin(event.target.value)}
            />
            <button
              onClick={createRoom}
              className="outline-none border border-black p-2 mb-4 rounded-3xl bg-transparent ml-2 text-black px-7"
            >
              Create Room
            </button>
          </div>
        </div>
      )}
      {/* send messages */}
      {showMsg && (
        <div>
          <div>
            <input
              placeholder="Message"
              className="outline-none border border-black p-2 mb-4 rounded-3xl bg-transparent w-[400px] text-black pl-4 pr-4"
              value={msg}
              onChange={(event) => setMsg(event.target.value)}
            ></input>
            <button
              onClick={sendMsg}
              className="outline-none border border-black p-2 mb-4 rounded-3xl bg-transparent ml-2 text-black pl-4 pr-4"
            >
              Send Message
            </button>
          </div>

          <div>
            <h1>MESSAGES</h1>
            {messages.map((message, index) => (
              <p key={index}>{message}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
