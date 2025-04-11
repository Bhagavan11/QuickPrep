import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Profile from "./Profile";
// import Navbar from "./Navbar";

const ProblemList = () => {
  const [problems, setProblems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve username from location state or fallback to localStorage
  const userName = location.state?.userName || localStorage.getItem("userName") || "Guest";
  
  console.log("Location: ", location); // Debugging
  console.log("userName: ", userName); // Debugging

  useEffect(() => {
    axios
      .get("http://localhost:5000/problems", { params: { userName } })
      .then((response) => setProblems(response.data))
      .catch((error) => console.error(error));
      const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      console.log('Retrieved token:', token);

      if (!token) {
        console.error('No token found! Redirecting to login.');
        navigate('/login');
        return;
      }
    }
    fetchUserData();
  }, [userName]);

  // Filter problems based on search query (by name or ID)
  const filteredProblems = problems.filter(
    (problem) =>
      problem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.problem_id.toString().includes(searchQuery)
  );

  return (
    <div className="container-fluid">
      
      {/* <Navbar userName={userName} /> */}
      <div className="d-flex justify-content-between align-items-center">
        <h1 className="m-0">Problems</h1>

        {/* Centered Search Box */}
        <div className="flex-grow-1 d-flex justify-content-center mx-3">
          <input
            type="text"
            placeholder="Search by Name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-box"
          />
        </div>

       
      </div>

      <table>
        <thead>
          <tr>
            <th>Problem ID</th>
            <th>Name</th>
            <th>Difficulty</th>
            <th>Status</th>
            <th>Solve</th>
          </tr>
        </thead>
        <tbody>
          {filteredProblems.map((problem) => (
            <tr key={problem.problem_id}>
              <td>{problem.problem_id}</td>
              <td>{problem.name}</td>
              <td>{problem.level_of_problem || "Unknown"}</td>
              <td>{problem.status || "Unsolved"}</td>
              <td>
                <span
                  className="solve-link"
                  onClick={() => navigate(`/codeeditor/${problem.problem_id}`, { state: { userName } })}
                >
                  Solve
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* CSS Styling */}
      <style>
        {`
        .container {
          width: 100%;
          margin: auto;
          text-align: center;
          background-color: #1e1e1e;
          color: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(255, 255, 255, 0.1);
        }

        h1 {
          color: #00d8ff;
        }

        /* Search Box */
        .search-box {
          width: 20%;
          padding: 10px;
          font-size: 16px;
          border-radius: 5px;
          border: 1px solid #00d8ff;
          margin-bottom: 20px;
          outline: none;
          background-color: #333;
          color: white;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }

        th, td {
          border: 1px solid #444;
          padding: 10px;
          text-align: center;
        }

        th {
          background-color: #333;
          color: #00d8ff;
        }

        tr:nth-child(even) {
          background-color: #2a2a2a;
        }

        tr:hover {
          background-color: #444;
        }

        .solve-link {
          color: #00d8ff;
          cursor: pointer;
          font-weight: bold;
        }

        .solve-link:hover {
          text-decoration: underline;
        }

        body, html {
          background-color: #1e1e1e;
          margin: 0;
          padding: 0;
          height: 100%;
          color: white;
        }
        `}
      </style>
    </div>
  );
};

export default ProblemList;
