interface ISocialAuth {
  getPrivateKey: () => string;
  loginWithGoogle: () => void;
}

export default ISocialAuth;
