import React, { useState } from "react";
import classes from "./SentMessage.module.css";
import { Collapse } from "react-bootstrap";

const MyMessage = ({ message, image, time }) => {
  const [timeVisible, setTimeVisible] = useState(false);
  const messsageContent = image ? (
    <img className={classes.Message__Content_Img} src={image} alt="sent-file" />
  ) : (
    <p className={classes.Message__Content_Text}> {message} </p>
  );

  return (
    <div
      className={classes.Message}
      onClick={() => setTimeVisible(!timeVisible)}
    >
      {" "}
      {messsageContent}{" "}
      <Collapse in={timeVisible}>
        <span className={classes.Message__Time}>{time}</span>
      </Collapse>
      <div className={classes.Message__Arrow}> </div>
    </div>
  );
};

export default MyMessage;
