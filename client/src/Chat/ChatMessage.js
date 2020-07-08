import React from "react";
import SentMessage from "./SentMessage";
import ReceivedMessage from "./ReceivedMessage";

const ChatMessage = ({ message, username, time, myMessage }) => {
  return (
    <>
      {myMessage ? (
        <SentMessage message={message} time={time} />
      ) : (
        <ReceivedMessage message={message} username={username} time={time} />
      )}
    </>
  );
};

export default ChatMessage;
