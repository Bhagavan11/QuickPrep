import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./FaqPage.css"; // 👈 import the CSS
import TypingHeader from "./TypingHeader";
import NoteButton from "./NoteButton";

const CompanyFaq = () => {
  const { company } = useParams(); // Fixed: use 'company' as the parameter
  console.log(company)
  const [qaList, setQaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const userName = localStorage.getItem("userName");
  

 useEffect(() => {
  const fetchQuestions = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/faq/${company}`);
      console.log("Fetched data:", res.data);  // Add logging here to see the response
      setQaList(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching FAQ:", error);
    }
  };

  fetchQuestions();
}, [company]);
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
      alert("Failed to save note");
    }
  };


  // Define or remove saveNotes as needed
 

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
      <h1>Interview Questions for {company}</h1>
      {qaList.map((item, index) => (
        <div key={index} className="qa-item">
          <div className="qa-question-row">
            <p>
              <strong>Q:</strong> {item.question}
            </p>
            <div className="note-button-container">
              <NoteButton
                username={userName}
                topic=" " 
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

export default CompanyFaq;
