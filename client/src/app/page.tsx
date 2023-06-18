
"use client"
import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

export default function Home() {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const sendMsg = () => {
    socket.emit("send_msg", msg);
    setMessages((prevMessages) => [...prevMessages, `You: ${msg}`]);
    setMsg("");
  };

  useEffect(() => {
    socket.on("receive_msg", (data: string) => {
      setMessages((prevMessages) => [...prevMessages, `Received: ${data}`]);
    });
  }, []);

  return (
    <div>
      <input
        placeholder="Message"
        value={msg}
        onChange={(event) => setMsg(event.target.value)}
      ></input>
      <button onClick={sendMsg}>Send Message</button>
      <h1>MESSAGE</h1>
      <div>
        {messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
    </div>
  );
}
