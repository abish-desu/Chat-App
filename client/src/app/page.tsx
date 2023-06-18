"use client"
import { useEffect, useState } from "react"
import io from "socket.io-client"
const socket = io("http://localhost:3001")
export default function Home() {
  const [ msg,setMsg] = useState("");
  const [messageReceived,setMessageReceived] = useState("");
  const sendMsg=()=>{
    socket.emit("send_msg",msg)

  }
useEffect(() => {
  socket.on("receive_msg", (data:string) => {
    setMessageReceived(data);
  });
}, [socket]);
  return (
 <div>
  <input placeholder='Message' onChange={(event)=>setMsg(event.target.value)}></input>
  <button onClick={sendMsg}>Send Message</button>
  <h1>MESSAGE</h1>
  {messageReceived}
 </div>
  )
}
