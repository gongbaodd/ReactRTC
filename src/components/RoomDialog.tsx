import React, { useState, useEffect, FC } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";

interface Props {
  onJoinRoom: (id: string) => Promise<boolean>;
  onClosed: () => Promise<void>;
}

const RoomDialog: FC<Props> = ({ onJoinRoom, onClosed }) => {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");

  useEffect(() => {
    setId("");
  }, [open]);

  return (
    <>
      <Button size="small" onClick={() => setOpen(true)}>
        加入房间
      </Button>
      <Dialog open={open} onExited={() => onClosed()}>
        <DialogTitle>Join a room</DialogTitle>n{" "}
        <DialogContent>
          <TextField
            label="room id"
            value={id}
            onChange={event => setId(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={async () => {
              const ok = await onJoinRoom(id);
              if (ok) {
                setOpen(false);
              } else {
                setId("");
              }
            }}
            color="primary"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RoomDialog;
