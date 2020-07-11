import React from "react";
import classes from "./OnlineUsersBox.module.css";

const OnlineUsersList = ({ users, mySocketID }) => {
  const usersList = users.map((user, index) => {
    const userClassName =
      user.socketID === mySocketID
        ? classes.UsersList__User_Me
        : classes.UsersList__User;
    return (
      <span
        className={userClassName}
        key={user.socketID}
        socketID={user.socketID}
      >
        {`${index + 1}. ${user.username}`}
      </span>
    );
  });

  return (
    <div className={classes.UsersList}>
      <h5 className={classes.UsersList__Title}>
        {" "}
        Users Online{" "}
        <div className={classes.UsersList__Title_GreenCircle}></div>{" "}
      </h5>
      <div className={classes.UsersList__Users}>{usersList}</div>
    </div>
  );
};

export default OnlineUsersList;
