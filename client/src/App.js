import React from "react";
import { Route } from "react-router-dom";
import Lobby from "./Lobby/Lobby";
import Chat from "./Chat/Chat";
import Layout from "./hoc/Layout/Layout";

function App() {
  return (
    <Layout>
      <Route path="/" exact component={Lobby} />
      <Route path="/chat" component={Chat} />
    </Layout>
  );
}

export default App;
