import React, { useState, useEffect, useRef } from "react";
import classes from "./Chat.module.css";
import io from "socket.io-client";
import ChatMessage from "./ChatMessage";
import OnlineUsersBox from "./OnlineUsersBox";
import NotificationsBox from "./NotificationsBox";
import Picker from "emoji-picker-react";
import { ArrowClockwise, Image, EmojiNeutral } from "react-bootstrap-icons";
import { Form, Button } from "react-bootstrap";

const Chat = ({ location }) => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socketID, setSocketID] = useState();
  const [messages, setMessages] = useState([
    { body: "Welcome to chat!", time: getCurrentTime() },
  ]);
  const [notificationMessages, setNotificationMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);

  const socketRef = useRef();

  useEffect(() => {
    setSocketListeners();
  }, [location.state.name]);

  const setSocketListeners = () => {
    socketRef.current = io.connect("/", {
      query: {
        username: location.state.name,
      },
    });

    socketRef.current.on("user-connected", ({ socketID, users }) => {
      setSocketID(socketID);
      setOnlineUsers(users);
    });

    socketRef.current.on("new-user-connected", (updatedUsers) => {
      const messageObj = {
        username: `${[...updatedUsers].pop().username}`,
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
  };

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
      id: socketID,
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
    setMessages([{ body: "Welcome to chat!", time: getCurrentTime() }]);
  };

  const refreshNotificationsBox = () => {
    setNotificationMessages([]);
  };

  const appendEmojiToMessage = (e, emojiObject) => {
    setMessage((message) => `${message}${emojiObject.emoji}`);
  };

  const toggleEmojiPicker = () => {
    setEmojiPickerVisible(!emojiPickerVisible);
  };

  function getCurrentTime() {
    return new Date().toLocaleTimeString();
  }

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
              myMessage={message.id === socketID}
            />
          );
        })}
        <div
          className={
            emojiPickerVisible
              ? classes.Chat__EmojiPicker
              : classes.Chat__EmojiPicker_Hidden
          }
        >
          <Picker
            disableSearchBar
            disableSkinTonePicker
            onEmojiClick={appendEmojiToMessage}
          />
        </div>
      </div>
      <Form className={classes.Chat__BottomPanel} onSubmit={sendMessage}>
        <Form.Control
          className={classes.Chat__Input}
          type="text"
          placeholder="Type something..."
          onChange={handleInputChange}
          value={message}
          maxLength="250"
        />
        <div className={classes.Chat__BottomPanelIcons}>
          <EmojiNeutral
            className={classes.Chat__EmojiIcon}
            onClick={toggleEmojiPicker}
          />
          <Image className={classes.Chat__ImageIcon} />
        </div>

        <Button className={classes.Chat__SendButton} type="submit">
          {" "}
          Send{" "}
        </Button>
      </Form>

      <div className={classes.Chat__OnlineUsers}>
        <OnlineUsersBox users={onlineUsers} mySocketID={socketID} />
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
