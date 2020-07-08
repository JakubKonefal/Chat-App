import React, { useState } from "react";
import classes from "./ReceivedMessage.module.css";
import { Collapse } from "react-bootstrap";

const ReceivedMessage = ({ message, time, username }) => {
  const [timeVisible, setTimeVisible] = useState(false);

  return (
    <div
      className={classes.Message}
      onClick={() => setTimeVisible(!timeVisible)}
    >
      <span className={classes.Message__Username}> {username} </span>
      <p className={classes.Message__Content}> {message} </p>
      <Collapse in={timeVisible}>
        <span className={classes.Message__Time}>{time}</span>
      </Collapse>
      <div className={classes.Message__Arrow}> </div>
    </div>
  );
};

export default ReceivedMessage;
