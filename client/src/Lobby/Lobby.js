import React, { useState } from "react";
import classes from "./Lobby.module.css";
import { withRouter, useHistory } from "react-router";
import { Form } from "react-bootstrap";

const Lobby = () => {
  const [name, setName] = useState("");
  const history = useHistory();
  const joinChat = () => {
    const location = {
      pathname: "/chat",
      name: name,
      fromLobby: true,
    };
    history.replace(location);
  };

  const handleInputChange = ({ target }) => {
    setName(target.value);
  };

  return (
    <div className={classes.Lobby__Window}>
      <h1 className={classes.Lobby__Title}> Chat - App </h1>
      <div className={classes.Lobby__Container}>
        <Form className={classes.Lobby__Form} onSubmit={joinChat}>
          <h5 className={classes.Lobby__FormTitle}> Join the chat!</h5>
          <Form.Label className={classes.Lobby__InputLabel}>
            Enter your name:
          </Form.Label>
          <Form.Control
            type="text"
            value={name}
            name="name"
            onChange={handleInputChange}
            maxLength="20"
            required
          />
          <button
            className={classes.Lobby__Button}
            type="submit"
            disabled={name.length < 3}
          >
            Join
          </button>
        </Form>
      </div>
    </div>
  );
};

export default withRouter(Lobby);
