import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FaRegCopy } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import TypingHeader from "./TypingHeader";

const ChatbotPage = () => {
  const userName=localStorage.getItem("userName");
  const intial_message = { type: "bot", content: `Welcome to QuickPrep, ${userName}! How can i help you` };


  const [query, setQuery] = useState("");
  const [conversation, setConversation] = useState([intial_message]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  });

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Code copied to clipboard!");
  };

  const parseMessage = (message) => {
    const regex = /<pre><code class="highlight">(\w+)\n([\s\S]*?)<\/code><\/pre>/g;
    let parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(message)) !== null) {
      const [fullMatch, language, code] = match;
      parts.push(message.substring(lastIndex, match.index)); // Push normal text
      parts.push({ language, code });
      lastIndex = match.index + fullMatch.length;
    }

    parts.push(message.substring(lastIndex)); // Push remaining text
    return parts;
  };

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setConversation((prev) => [...prev, { type: "bot", content: "Please enter a query." }]);
      return;
    }

    setConversation((prev) => [...prev, { type: "user", content: query }]);

    try {
      const res = await axios.post(
        "http://localhost:5000/chat",
        { query },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setConversation((prev) => [...prev, { type: "bot", content: res.data.response }]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setConversation((prev) => [...prev, { type: "bot", content: "Error retrieving response" }]);
    }

    setQuery("");
  };

  return (
    <div style={styles.page}>
      <TypingHeader />
      <div style={styles.chatContainer}>
        <div style={styles.messages}>
          {conversation.map((msg, index) => (
            <div key={index} style={msg.type === "user" ? styles.userMessage : styles.botMessage}>
              {msg.type === "user" ? "You: " : "Bot: "}
              {parseMessage(msg.content).map((part, i) =>
                typeof part === "string" ? (
                  <span key={i}>{part}</span>
                ) : (
                  <div key={i} style={{ position: "relative" }}>
                    <SyntaxHighlighter language={part.language} style={oneDark} wrapLines>
                      {part.code}
                    </SyntaxHighlighter>
                    <button onClick={() => handleCopy(part.code)} style={styles.copyButton}>
                      <FaRegCopy size={18} />
                    </button>
                  </div>
                )
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleQuerySubmit} style={styles.inputContainer}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question..."
            style={styles.input}
            required
          />
          <button type="submit" style={styles.sendButton}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  page: {
    fontFamily: "Arial, sans-serif",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#1a1a1a",
    color: "#fff",
    height: "100vh",
    padding: "30px",
    width: "100%",
  },
  chatContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    height: "100%",
    width: "100%",
    margin: "0 auto",
    backgroundColor: "#121212",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.6)",
  },
  messages: {
    flex: 1,
    width: "100%",
    maxHeight: "calc(100vh - 200px)",
    overflowY: "auto",
    padding: "15px",
    backgroundColor: "#1e1e1e",
    borderRadius: "12px",
    marginBottom: "15px",
    boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.5)",
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
    lineHeight: "1.6",
  },
  userMessage: {
    width: "100%",
    textAlign: "right",
    color: "#d4ff1f",
    backgroundColor: "#2a2a2a",
    borderRadius: "10px",
    padding: "12px 18px",
    marginBottom: "10px",
    alignSelf: "flex-end",
    boxShadow: "0 4px 12px rgba(255, 255, 255, 0.1)",
  },
  botMessage: {
    textAlign: "left",
    color: "#50fa7b",
    backgroundColor: "#333",
    borderRadius: "10px",
    padding: "12px 18px",
    marginBottom: "10px",
    maxWidth: "100%",
    alignSelf: "flex-start",
    boxShadow: "0 4px 12px rgba(0, 255, 127, 0.1)",
  },
  copyButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#ccc",
    transition: "color 0.3s",
  },
  inputContainer: {
    display: "flex",
    width: "100%",
    padding: "15px",
    backgroundColor: "#222",
    borderTop: "1px solid #444",
    borderRadius: "12px",
  },
  input: {
    flex: 1,
    padding: "12px 15px",
    fontSize: "16px",
    border: "2px solid #444",
    borderRadius: "8px",
    backgroundColor: "#2c3e50",
    color: "#fff",
    marginRight: "15px",
    transition: "border-color 0.3s",
  },
  sendButton: {
    padding: "12px 20px",
    fontSize: "16px",
    backgroundColor: "#ff79c6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};

export default ChatbotPage;
