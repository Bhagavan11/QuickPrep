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
    flexWrap: "wrap", // Allow wrapping on smaller screens
    gap: "10px", // Space between items
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

  // ✅ Media Queries for Responsiveness
  "@media (max-width: 768px)": {
    header: {
      fontSize: "24px", // Slightly smaller font size on tablets
      padding: "12px",
    },
    gradient: {
      fontSize: "22px", // Smaller gradient text
    },
  },

  "@media (max-width: 480px)": {
    header: {
      fontSize: "20px", // Smaller font size on mobile
      padding: "10px",
      justifyContent: "flex-start", // Align items to the left on small screens
    },
    gradient: {
      fontSize: "18px", // Adjust gradient text size for mobile
    },
    username: {
      marginLeft: "5px", // Smaller margin on mobile
    },
  },
};

export default TypingHeader;
