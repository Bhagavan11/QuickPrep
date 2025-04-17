import React, { useState } from "react";
import { FaStickyNote } from "react-icons/fa";

const NoteButton = ({ username, topic, question, answer, note_type, onClick }) => {
  const [saved, setSaved] = useState(false);

  const handleClick = async () => {
    const details = { username, topic, question, answer, note_type };
    try {
      await onClick(details);
      setSaved(true);
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  return (
    <FaStickyNote
      onClick={handleClick}
      style={{
        color: saved ? "green" : "yellow",
        cursor: "pointer",
        marginLeft: "10px",
        width:'50%',
        height:'50px'
      }}
      title="Save Note"
    />
  );
};

export default NoteButton;
