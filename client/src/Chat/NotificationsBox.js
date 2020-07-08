import React from "react";
import classes from "./NotificationsBox.module.css";
import { ArrowClockwise } from "react-bootstrap-icons";

const NotificationsBox = ({ messages, refresh }) => {
  return (
    <div className={classes.Notifications}>
      <h5 className={classes.Notifications__Title}>
        {" "}
        Notifications{" "}
        <ArrowClockwise
          className={classes.Notifications__RefreshIcon}
          onClick={refresh}
        />
      </h5>
      <div className={classes.Notifications__Messages}>
        {messages.map((message, index) => {
          const connected = message.event === "connected";
          return (
            <p
              className={
                connected
                  ? classes.Notifications__Message_Connected
                  : classes.Notifications__Message_Disconnected
              }
              key={index}
            >
              <mark className={classes.Notifications__Message_Username}>
                {message.username}
              </mark>{" "}
              {message.event}.
            </p>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationsBox;
