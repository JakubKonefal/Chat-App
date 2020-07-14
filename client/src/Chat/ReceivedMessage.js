import React, { useState } from "react";
import classes from "./ReceivedMessage.module.css";
import { Collapse } from "react-bootstrap";

const ReceivedMessage = ({ message, image, time, username }) => {
  const [timeVisible, setTimeVisible] = useState(false);
  console.log(message);
  const msgimg = image ? <img src={image} width="200" /> : null;

  return (
    <div
      className={classes.Message}
      onClick={() => setTimeVisible(!timeVisible)}
    >
      <span className={classes.Message__Username}> {username} </span>
      <p className={classes.Message__Content}>
        {" "}
        {message} {msgimg}{" "}
      </p>
      <Collapse in={timeVisible}>
        <span className={classes.Message__Time}>{time}</span>
      </Collapse>
      <div className={classes.Message__Arrow}> </div>
    </div>
  );
};

export default ReceivedMessage;
