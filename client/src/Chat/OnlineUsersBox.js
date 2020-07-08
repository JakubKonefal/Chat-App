import React from "react";
import classes from "./OnlineUsersBox.module.css";

const OnlineUsersList = ({ users }) => {
  const usersList = users.map((user, index) => (
    <span className={classes.UsersList__User} key={index}>
      {`${index + 1}. ${user}`}
    </span>
  ));

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
