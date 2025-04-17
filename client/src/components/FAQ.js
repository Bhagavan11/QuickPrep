import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./FaqPage.css"; // 👈 import the CSS
import TypingHeader from "./TypingHeader";
import NoteButton from "./NoteButton";

const FaqPage = () => {
  const { topic } = useParams();
  const [qaList, setQaList] = useState([]);
  const [loading, setloading] = useState(true);
  const [err,setErr]=useState(false)
  const userName = localStorage.getItem("userName");

  const saveNotes = async ({ username, topic, question, answer, note_type }) => {
    try {
      const res = await axios.post("http://localhost:5000/notes/save", {
        username,
        topic,
        question,
        answer,
        note_type,
      });

      console.log("Note saved:", res.data);
      // Optional: show toast or feedback
    } catch (error) {
      console.error("Error saving note:", error);
      setErr(err)
      setloading(false)
      alert("Failed to save note");
    }
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/faq/${topic}`);
        setQaList(res.data);
        setloading(false);
        console.log(res.data);
      } catch (error) {
        console.error("Error fetching FAQ:", error);
      }
    };

    fetchQuestions();
  }, [topic]);

  if (loading) {
    return (
      <div>
        <div>
          <TypingHeader />
        </div>
        <div className="loader">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="faq-container">
      <TypingHeader />
      <h1>Interview Questions for {topic}</h1>
      {qaList.map((item, index) => (
        <div key={index} className="qa-item">
          <div className="qa-question-row">
            <p>
              <strong>Q:</strong> {item.question}
            </p>
            <div className="note-button-container">
              <NoteButton
                username={userName}
                topic={topic}
                question={item.question}
                answer={item.answer}
                note_type="faq"
                onClick={saveNotes}
              />
            </div>
          </div>
          <button
            onClick={() => {
              const updatedList = [...qaList];
              updatedList[index].showAnswer = !updatedList[index].showAnswer;
              setQaList(updatedList);
            }}
          >
            {item.showAnswer ? "Hide Answer" : "Show Answer"}
          </button>
          {item.showAnswer && (
            <p>
              <strong>A:</strong> {item.answer}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default FaqPage;
