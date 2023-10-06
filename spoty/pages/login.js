import { signIn } from "next-auth/react";
import React from "react";

const Login = () => {
  const buttonStyle = {
    backgroundColor: "darkgreen",
    color: "white",
    padding: "10px 20px",
    borderRadius: "10px", // Rounded corners
    cursor: "pointer",
  };

  const containerStyle = {
    minHeight: "100vh", // Set minimum height to fill the viewport
    backgroundColor: "black", // Black background color
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column", // Center content vertically and horizontally
  };

  const logoStyle = {
    color: "white",
    fontSize: "24px",
    marginBottom: "20px",
  };

  return (
    <div style={containerStyle}>
      <h1 style={logoStyle}>AudioJam</h1>
      <button style={buttonStyle} onClick={() => signIn("spotify", { callbackUrl: "/profile" })}>
        Login with Spotify
      </button>
    </div>
  );
};

export default Login;
