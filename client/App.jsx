import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Login from './components/login';
import Chat from './components/chat';
import Sidebar from './components/sidebar';

const socket = io('http://localhost:3000');

function App() {
  const [user, setUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageList, setMessageList] = useState([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    if (user) {
      socket.emit('register', user);
    }
  }, [user]);

  useEffect(() => {
    socket.on('receive_message', (messageData) => {
      setMessageList((prevList) => [...prevList, messageData]);
    });

    socket.on('user_connected', () => {
      setRefresh((prev) => prev + 1);
    });

    socket.on('user_disconnected', () => {
      setRefresh((prev) => prev + 1);
    });

    return () => {
      socket.off('receive_message');
      socket.off('user_connected');
      socket.off('user_disconnected');
    };
  }, []);

  const handleLogin = (name) => {
    setUser(name);
  };

  const sendMessage = (messageData) => {
    socket.emit('send_message', messageData);
  };

  if (!user) {
    return <Login onSubmit={handleLogin} />;
  }

  return (
    <div className="flex h-screen">
      <Sidebar
        refresh={refresh}
        user={user}
        setSelectedUser={setSelectedUser}
        selectedUser={selectedUser}
        messageList={messageList}
        setMessageList={setMessageList}
      />
      <Chat
        user={user}
        selected={selectedUser}
        sendMessage={sendMessage}
        messageList={messageList.filter(
          (m) =>
            (m.sender === user && m.receiver === selectedUser) ||
            (m.sender === selectedUser && m.receiver === user)
        )}
      />
    </div>
  );
}

export default App;