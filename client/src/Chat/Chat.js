import React, { useState, useEffect, useRef } from "react";
import classes from "./Chat.module.css";
import io from "socket.io-client";
import ChatMessage from "./ChatMessage";
import OnlineUsersBox from "./OnlineUsersBox";
import NotificationsBox from "./NotificationsBox";
import { ArrowClockwise } from "react-bootstrap-icons";
import { Form, Button } from "react-bootstrap";

const Chat = ({ location }) => {
  const timeOfJoiningChat = new Date().toLocaleTimeString();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socketId, setSocketId] = useState();
  const [messages, setMessages] = useState([
    { body: "Welcome to chat!", time: timeOfJoiningChat },
  ]);
  const [notificationMessages, setNotificationMessages] = useState([]);
  const [message, setMessage] = useState("");

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io.connect("/", {
      query: {
        username: location.state.name,
      },
    });

    socketRef.current.on("user-connected", ({ socketID, users }) => {
      setSocketId(socketID);
      setOnlineUsers(users);
    });

    socketRef.current.on("new-user-connected", (updatedUsers) => {
      const messageObj = {
        username: `${[...updatedUsers].pop()}`,
        event: "connected",
      };
      setNotificationMessages((oldMessages) => [...oldMessages, messageObj]);
      setOnlineUsers(updatedUsers);
    });

    socketRef.current.on("receive-message", (message) => {
      receiveMessage(message);
    });

    socketRef.current.on(
      "user-disconnected",
      ({ updatedUsers, disconnectedUser }) => {
        setOnlineUsers(updatedUsers);
        setNotificationMessages((oldMessages) => [
          ...oldMessages,
          { username: `${disconnectedUser}`, event: "disconnected" },
        ]);
      }
    );
  }, [location.state.name]);

  const receiveMessage = (message) => {
    setMessages((oldMessages) => [...oldMessages, message]);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message) {
      return;
    }

    const timeOfSendingMessage = new Date().toLocaleTimeString();

    const messageObj = {
      body: message,
      id: socketId,
      username: location.state.name,
      time: timeOfSendingMessage,
    };
    socketRef.current.emit("send-message", messageObj);
    setMessage("");
    setMessages((oldMessages) => [...oldMessages, messageObj]);
  };

  const handleInputChange = ({ target }) => {
    setMessage(target.value);
  };

  const refreshMessagesBox = () => {
    const timeOfRefreshing = new Date().toLocaleTimeString();
    setMessages([{ body: "Welcome to chat!", time: timeOfRefreshing }]);
  };

  const refreshNotificationsBox = () => {
    setNotificationMessages([]);
  };

  return (
    <div className={classes.Chat}>
      <div className={classes.Chat__Topbar}>
        <span className={classes.Chat__Username}>{location.state.name}</span>
        <ArrowClockwise
          className={classes.Chat__RefreshIcon}
          onClick={refreshMessagesBox}
        />
      </div>
      <div className={classes.Chat__Messages}>
        {messages.map((message, index) => {
          return (
            <ChatMessage
              key={index}
              message={message.body}
              username={message.username}
              time={message.time}
              myMessage={message.id === socketId}
            />
          );
        })}
      </div>
      <Form
        className={classes.Chat__BottomPanel}
        onSubmit={(event) => sendMessage(event)}
      >
        <Form.Control
          className={classes.Chat__Input}
          type="text"
          placeholder="Type something..."
          onChange={(event) => handleInputChange(event)}
          value={message}
          maxLength="250"
        />
        <Button className={classes.Chat__SendButton} type="submit">
          {" "}
          Send{" "}
        </Button>
      </Form>
      <div className={classes.Chat__OnlineUsers}>
        <OnlineUsersBox users={onlineUsers} />
      </div>
      <div className={classes.Chat__Notifications}>
        <NotificationsBox
          messages={notificationMessages}
          refresh={refreshNotificationsBox}
        />
      </div>
    </div>
  );
};

export default Chat;
