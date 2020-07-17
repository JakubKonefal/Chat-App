import React, { useState, useEffect, useRef } from "react";
import classes from "./Chat.module.css";
import io from "socket.io-client";
import ChatMessage from "./ChatMessage";
import OnlineUsersBox from "./OnlineUsersBox";
import NotificationsBox from "./NotificationsBox";
import Picker from "emoji-picker-react";
import { DropdownButton, Dropdown } from "react-bootstrap";
import { getCurrentTime } from "../utils/utils";
import { ArrowClockwise, Image, EmojiSmile, X } from "react-bootstrap-icons";
import { Form, Button } from "react-bootstrap";

const Chat = ({ location }) => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socketID, setSocketID] = useState();
  const [currentRoom, setCurrentRoom] = useState({ roomName: "General" });
  const [messages, setMessages] = useState({
    General: {
      messages: [{ body: "Welcome to chat!" }],
    },
  });
  const [notificationMessages, setNotificationMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [chosenImage, setChosenImage] = useState(null);

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

    socketRef.current.on("receive-private-message", (message) => {
      receivePrivateMessage(message);
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

  const handleRoomSelect = (roomName, event) => {
    const roomObj = {
      roomName,
      socketID: event.target.id,
    };
    setCurrentRoom(roomObj);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message && !chosenImage) {
      return;
    }

    const timeOfSendingMessage = getCurrentTime();
    const messageObj = {
      receiverID: currentRoom.socketID,
      body: message,
      image: chosenImage,
      senderID: socketID,
      sender: location.state.name,
      time: timeOfSendingMessage,
    };

    currentRoom.roomName === "General"
      ? socketRef.current.emit("send-message", messageObj)
      : socketRef.current.emit("send-private-message", messageObj);

    setMessages((oldMessages) =>
      oldMessages[currentRoom.roomName]
        ? {
            ...oldMessages,
            [currentRoom.roomName]: {
              messages: [
                ...oldMessages[currentRoom.roomName].messages,
                messageObj,
              ],
            },
          }
        : {
            ...oldMessages,
            [currentRoom.roomName]: {
              messages: [messageObj],
            },
          }
    );
    setMessage("");
    setChosenImage(null);
    setEmojiPickerVisible(false);
  };

  const receiveMessage = (message) => {
    setMessages((oldMessages) => ({
      ...oldMessages,
      [currentRoom.roomName]: {
        messages: [...oldMessages[currentRoom.roomName].messages, message],
      },
    }));
  };

  const receivePrivateMessage = (message) => {
    setMessages((oldMessages) =>
      oldMessages[message.sender]
        ? {
            ...oldMessages,
            [message.sender]: {
              messages: [...oldMessages[message.sender].messages, message],
            },
          }
        : {
            ...oldMessages,
            [message.sender]: {
              messages: [message],
            },
          }
    );
  };

  const handleInputChange = ({ target }) => {
    setMessage(target.value);
  };

  const handleImageSelect = (e) => {
    setChosenImage(URL.createObjectURL(e.target.files[0]));
    setMessage("");
    setEmojiPickerVisible(false);
  };

  const cancelImageSelect = () => {
    setChosenImage(null);
  };

  const refreshMessagesBox = () => {
    setMessages([{ body: "Welcome to chat!", time: getCurrentTime() }]);
  };

  const refreshNotificationsBox = () => {
    setNotificationMessages([]);
  };

  const toggleEmojiPicker = () => {
    setEmojiPickerVisible(!emojiPickerVisible);
  };

  const appendEmojiToMessage = (e, emojiObj) => {
    setMessage((message) => `${message}${emojiObj.emoji}`);
  };

  return (
    <div className={classes.Chat}>
      <div className={classes.Chat__Topbar}>
        <DropdownButton
          bsPrefix={classes.Chat__SelectButton}
          variant="none"
          onSelect={handleRoomSelect}
          title={currentRoom.roomName}
        >
          <Dropdown.Item key="General" eventKey="General">
            General chat
          </Dropdown.Item>
          {onlineUsers.map((user) => {
            if (user.socketID !== socketID) {
              return (
                <Dropdown.Item
                  key={user.socketID}
                  id={user.socketID}
                  eventKey={user.username}
                >
                  {user.username}
                </Dropdown.Item>
              );
            }
          })}
        </DropdownButton>
        <ArrowClockwise
          className={classes.Chat__RefreshIcon}
          onClick={refreshMessagesBox}
        />
      </div>
      <div className={classes.Chat__Messages}>
        {console.log(messages)}
        {messages[currentRoom.roomName]
          ? messages[currentRoom.roomName].messages.map((message, index) => {
              return (
                <ChatMessage
                  key={index}
                  message={message.body}
                  image={message.image}
                  username={message.sender}
                  time={message.time}
                  myMessage={message.senderID === socketID}
                />
              );
            })
          : null}
        <div
          className={
            emojiPickerVisible ? classes.Chat__EmojiPicker : classes.Hidden
          }
        >
          <Picker
            disableSearchBar
            disableSkinTonePicker
            onEmojiClick={appendEmojiToMessage}
          />
        </div>
        <div
          className={
            chosenImage ? classes.Chat__PreviewFileBox : classes.Hidden
          }
        >
          <X
            className={classes.Chat__PreviewFileCancelBtn}
            onClick={cancelImageSelect}
          />
          <img
            className={classes.Chat__PreviewFile}
            src={chosenImage}
            alt="preview-file"
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
          disabled={chosenImage}
          maxLength="250"
        />
        <div className={classes.Chat__BottomPanelIcons}>
          <EmojiSmile
            className={
              chosenImage
                ? classes.Chat__EmojiIcon_disabled
                : classes.Chat__EmojiIcon
            }
            onClick={toggleEmojiPicker}
          />
          <Form.Control
            type="file"
            id="image"
            name="image"
            onChange={handleImageSelect}
          />
          <label className={classes.Chat__ImageIcon} htmlFor="image">
            {" "}
            <Image />{" "}
          </label>
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
