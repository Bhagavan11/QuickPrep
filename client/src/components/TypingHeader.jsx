import { useEffect, useState } from "react";

const TypingHeader = () => {
  const [userName, setUserName] = useState("...");

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    setUserName(storedUserName ? storedUserName.toUpperCase() : "GUEST");
  }, []);

  return (
    <header style={styles.header}>
      <span style={styles.logo}>
        <span style={styles.orange}>QUICK</span>
        <span style={styles.pink}>PREP</span>
      </span>
      <span style={styles.username}> | <span style={styles.gradient}>{userName}</span></span>
    </header>
  );
};

const styles = {
  header: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "28px",
    fontWeight: "bold",
    padding: "15px",
    backgroundColor: "#222", // Same dark navbar background
    fontFamily: "'Poppins', sans-serif",
  },
  logo: {
    display: "flex",
  },
  orange: {
    color: "#FF5733", // Same orange as navbar
  },
  pink: {
    color: "#E91E63", // Same pink as navbar
  },
  username: {
    marginLeft: "10px",
  },
  gradient: {
    background: "linear-gradient(45deg, #FF5733, #E91E63)",
    WebkitBackgroundClip: "text",
    color: "transparent",
    fontWeight: "bold",
    textTransform: "uppercase",
    animation: "glow 1.5s infinite alternate",
  },
};

export default TypingHeader;
