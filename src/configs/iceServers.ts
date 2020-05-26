const config = {
  iceServers: [
    {
      url: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
} as const;

export default config;
