import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import axios from "axios";
import "./Dashboard.css";
import { ResponsiveContainer } from "recharts";
import Navbar from './Navbar';
import Profile from './Profile';

// Colors for Pie Chart
const COLORS = ["#0088FE", "#FFBB28"];

// Dashboard Component with Data Fetching
const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName");
   const toggleProfile = () => {
    setShowProfile((prev) => !prev);
  }

  useEffect(() => {
    const fetchProblemDetails = async () => {
      const token = localStorage.getItem("token");
      console.log("Retrieved token:", token);
      try {
        if (!token) {
          console.error("No token found! Redirecting to login.");
          navigate("/login");
          return;
        }
        const response = await axios.get(`http://localhost:5000/api/user-progress/${userName}`);
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching problem details:", error);
      }
    };
    fetchProblemDetails();
  }, [navigate, userName]);

  if (!userData) {
    return <h2>Loading...</h2>;
  }

  const pieData = [
    { name: "Solved", value: userData.solved },
    { name: "Unsolved", value: userData.total - userData.solved },
  ];

  const barData = [
    { name: "Easy", solved: userData.categories.easy },
    { name: "Medium", solved: userData.categories.medium },
    { name: "Hard", solved: userData.categories.hard },
  ];

  return (
    <div className="dashboard-container">
  <h1>User Progress Dashboard</h1>
  <div className="charts-container">

    {/* Pie Chart */}
    <div className="chart-box">
      <h2>Problems Solved</h2>
      <ResponsiveContainer width={400} height={300}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            startAngle={90}
            endAngle={-270}
            fill="#8884d8"
            dataKey="value"
            isAnimationActive={true}
          >
            {pieData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="none"
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: "#222", borderColor: "#00ffe7" }}
            labelStyle={{ color: "#00ffe7" }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div style={{ marginTop: "-150px", fontSize: "20px", fontWeight: "bold", color: "#00ffe7" }}>
        {userData.solved}/{userData.total} Solved
      </div>
    </div>

    {/* Bar Chart */}
    <div className="chart-box">
      <h2>Problems Solved by Difficulty</h2>
      <ResponsiveContainer width={500} height={300}>
        <BarChart data={barData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="name" stroke="#fff" />
          <YAxis stroke="#fff" />
          <Tooltip
            contentStyle={{ backgroundColor: "#222", borderColor: "#00ffe7" }}
            labelStyle={{ color: "#00ffe7" }}
          />
          <Legend />
          <Bar dataKey="solved" fill="url(#colorGradient)">
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00ffe7" stopOpacity={1} />
                <stop offset="100%" stopColor="#0088FE" stopOpacity={0.8} />
              </linearGradient>
            </defs>
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>

  </div>
</div>
  )
}








export default Dashboard;


