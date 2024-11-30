import React, { useState } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PhoneIcon from "@mui/icons-material/Phone";
import { CopyToClipboard } from "react-copy-to-clipboard";

const VideoControls = ({
  me,
  name,
  setName,
  idToCall,
  setIdToCall,
  callAccepted,
  callEnded,
  leaveCall,
  callUser,
  receivingCall,
  callerName,
  answerCall,
}) => {
  return (
    <div className="myId">
      <TextField
        id="name"
        label="Name"
        variant="filled"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ marginBottom: "20px" }}
      />
      <CopyToClipboard text={me} style={{ marginBottom: "2rem" }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AssignmentIcon fontSize="large" />}
        >
          Copy ID
        </Button>
      </CopyToClipboard>

      <TextField
        id="id-to-call"
        label="ID to call"
        variant="filled"
        value={idToCall}
        onChange={(e) => setIdToCall(e.target.value)}
      />
      <div className="call-button">
        {callAccepted && !callEnded ? (
          <Button variant="contained" color="secondary" onClick={leaveCall}>
            End Call
          </Button>
        ) : (
          <IconButton
            color="primary"
            aria-label="call"
            onClick={() => callUser(idToCall)}
          >
            <PhoneIcon fontSize="large" />
          </IconButton>
        )}
      </div>
      {receivingCall && !callAccepted && (
        <div className="caller">
          <h1>{callerName} is calling...</h1>
          <Button variant="contained" color="primary" onClick={answerCall}>
            Answer
          </Button>
        </div>
      )}
    </div>
  );
};

export default VideoControls;
