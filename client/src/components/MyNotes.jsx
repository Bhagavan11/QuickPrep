import axios from 'axios'
import React, { useEffect, useState } from 'react'
import TypingHeader from './TypingHeader'
import './MyNotes.css'
const MyNotes = () => {
    const userName = localStorage.getItem("userName")
    const [notes, setNotes] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/fetchNotes/${userName}`)
                setNotes(res.data.rows)
                console.log(res.data.rows)
                setLoading(false)
            } catch (error) {
                console.log("error fetching notes", error)
                setLoading(false)
            }
        }
        fetchNotes()
    }, [])

    const deleteNote = async (noteId) => {
    try {
        const res=await axios.delete(`http://localhost:5000/deleteNote/${noteId}`)
        // Optionally update UI after deletion:
        setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId))
        console.log("Note deleted successfully",res)
    } catch (error) {
        console.error("Error deleting note:", error)
    }
}


    if (loading) {
        return (
            <div>
                <TypingHeader />
                <div className="loader">
                    <div className="spinner"></div>
                </div>
            </div>
        )
    }

    return (
       <div>
        <TypingHeader />
        <div className="notes-container">
            {notes.length === 0 ? (
                <div className="no-notes-message">
                    <h2>No notes found.</h2>
                    <p>Start adding some notes to see them here!</p>
                </div>
            ) : (
                notes.map((note, index) => (
                    <div key={index} className="note-card">
                        <h1 className="note-topic">{note.topic}</h1>
                        <h3 className="note-question">{note.question}</h3>
                        <p className="note-answer">{note.answer}</p>
                        <button className="delete-btn" onClick={() => deleteNote(note.id)}>Delete</button>
                    </div>
                ))
            )}
        </div>
    </div>
    )
}

export default MyNotes
