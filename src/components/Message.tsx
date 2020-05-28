import React, { useState } from "react";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useOnMessage, useSendMessageCallback } from "./PeerConnection";

const Message = () => {
  const [message, setMessage] = useState("");
  const [remoteMsg, setRemoteMsg] = useState("...");
  const sendMessage = useSendMessageCallback();

  useOnMessage(m => setRemoteMsg(m));

  return (
    <Paper style={{ padding: "20px" }}>
      <p>{remoteMsg}</p>
      <TextField
        value={message}
        onChange={({ target }) => setMessage(target.value)}
      />
      <Button onClick={() => sendMessage(message)}>发送</Button>
    </Paper>
  );
};

export default Message;
