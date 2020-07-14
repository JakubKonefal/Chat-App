import React from "react";
import SentMessage from "./SentMessage";
import ReceivedMessage from "./ReceivedMessage";

const ChatMessage = ({ message, image, username, time, myMessage }) => {
  return myMessage ? (
    <SentMessage message={message} time={time} image={image} />
  ) : (
    <ReceivedMessage
      message={message}
      image={image}
      username={username}
      time={time}
    />
  );
};

export default ChatMessage;
