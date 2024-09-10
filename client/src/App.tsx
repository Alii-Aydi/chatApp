import React, { useState, useEffect } from 'react';
import socket from './Socket/socket';
import './App.scss';

const App: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [room, setRoom] = useState('');
  const [privateRecipient, setPrivateRecipient] = useState('');

  useEffect(() => {
    socket.on('receive-message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on('user-disconnected', (id) => {
      console.log(`User disconnected: ${id}`);
    });

    return () => {
      socket.off('receive-message');
      socket.off('user-disconnected');
    };
  }, []);

  const joinRoom = () => {
    if (room) {
      socket.emit('join-room', room);
    }
  };

  const sendMessage = () => {
    if (privateRecipient) {
      socket.emit('send-private-message', { message, to: privateRecipient });
    } else if (room) {
      socket.emit('send-message', { message, room });
      console.log(room)
    } else {
      socket.emit('send-message', { message });
    }
    setMessage('');
  };

  return (
    <div className="chat-container">
      <div className="room-join-container">
        <input
          type="text"
          placeholder="Room"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <button onClick={joinRoom}>Join Room</button>
      </div>

      <div className="input-container">
        <input
          type="text"
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <input
          type="text"
          placeholder="Private Recipient ID"
          value={privateRecipient}
          onChange={(e) => setPrivateRecipient(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>

      <div className="messages-container">
        <h2>Messages:</h2>
        {messages.map((msg, index) => (
          <p key={index} className="message">
            {msg}
          </p>
        ))}
      </div>
    </div>
  );
};

export default App;
