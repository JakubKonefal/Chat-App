import React, { useState } from "react";
import classes from "./SentMessage.module.css";
import { Collapse } from "react-bootstrap";

const MyMessage = ({ message, time }) => {
  const [timeVisible, setTimeVisible] = useState(false);

  return (
    <div
      className={classes.Message}
      onClick={() => setTimeVisible(!timeVisible)}
    >
      <p className={classes.Message__Content}> {message} </p>
      <Collapse in={timeVisible}>
        <span className={classes.Message__Time}>{time}</span>
      </Collapse>
      <div className={classes.Message__Arrow}> </div>
    </div>
  );
};

export default MyMessage;
