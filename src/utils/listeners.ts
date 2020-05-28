export const listenConnection = (conn: RTCPeerConnection) => {
  conn.addEventListener("icegatheringstatechange", () =>
    console.log(
      `[listen P2P] ICE gathering state changed: ${conn.iceGatheringState}`,
    ),
  );

  conn.addEventListener("connectionstatechange", () =>
    console.log(
      `[listen P2P] Connection state change: ${conn.connectionState}`,
    ),
  );

  conn.addEventListener("signalingstatechange", () => {
    console.log(`[listen P2P] Signaling state change: ${conn.signalingState}`);
  });

  conn.addEventListener("iceconnectionstatechange", () =>
    console.log(
      `[listen P2P] ICE connection state change: ${conn.iceConnectionState}`,
    ),
  );
};

export const listenChannel = (channel: RTCDataChannel) => {
  channel.addEventListener("open", () => {
    console.log("[listen channel] channel open");
  });

  channel.addEventListener("close", () => {
    console.log("[listen channel] channel close");
  });
};
