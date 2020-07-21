import React, { useState } from "react";
import classes from "./Lobby.module.css";
import { withRouter, useHistory } from "react-router";
import { Form, Modal } from "react-bootstrap";
import { InfoCircleFill } from "react-bootstrap-icons";

const Lobby = ({ location }) => {
  const [redirectedFromChat, setRedirectedFromChat] = useState(
    location.state && location.state.redirected
  );
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

  const handleModalClose = () => {
    setRedirectedFromChat(false);
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
            className={classes.Lobby__Input}
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
      <Modal show={redirectedFromChat} onHide={handleModalClose} centered>
        <Modal.Body className={classes.Lobby__Modal}>
          <InfoCircleFill className={classes.Lobby__ModalIcon} />
          You have been disconnected from the chat!
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default withRouter(Lobby);
