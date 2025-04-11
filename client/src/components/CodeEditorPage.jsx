import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { useLocation,useNavigate } from 'react-router-dom';
import './CodeEditorPage.css'

const CodeEditorPage = () => {
  const [runtime, setRunTime] = useState("");
const [status, setStatus] = useState("");
const navigate = useNavigate();

  const { problem_id } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("// Write your code here...");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("python");
  const [expected_output,setExpected_output]=useState(" ")
  const [error, setError] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false); // State for analysis popup
  const [analysisResult, setAnalysisResult] = useState(""); // Stores analysis response
  const location = useLocation();
  const userName = location.state?.userName || "Guest"; 
  const[problem_level, setProblem_level] = useState(null);

  useEffect(() => {
    if (!problem_id) return;
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      console.log('Retrieved token:', token);

      if (!token) {
        console.error('No token found! Redirecting to login.');
        navigate('/login');
        return;
      }
    }

    const fetchProblemDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/problems/${problem_id}`);
        setProblem(response.data);
        setCode(response.data.function_signature)
       setExpected_output(response.data.output_1);
       setProblem_level(response.data.level_of_problem);

      } catch (error) {
        console.error("Error fetching problem details:", error);
      }
    };

    fetchProblemDetails();
    fetchUserData();
  }, [problem_id]);

  const getLanguageExtension = () => {
    switch (language) {
      case "javascript":
        return javascript();
      case "python":
        return python();
      case "java":
        return java();
      case "cpp":
        return cpp();
      default:
        return javascript();
    }
  };
    const Analyze = async () => {
      
    try {
      const response = await axios.post("http://localhost:5000/analyze", {
        description: problem.description,
        code: code,
        language: language,
      });
      setAnalysisResult(response.data.response);
      console.log(response)
      console.log(analysisResult)
      setShowAnalysis(true);
      console.log("button clicked")
      console.log(problem.description)
      console.log(response)
      // Store the Gemini API response
      localStorage.setItem("chatMessages", JSON.stringify([{ sender: "Gemini", text: response.data.analysis }]));

     
      
    } catch (error) {
      console.error("Error analyzing code:", error);
      setError(error)
    }
  };


const runCode = async () => {
  try {
    const response = await axios.post("http://localhost:5000/execute", {
      problem_id: problem_id,
      code: code,
      language: language,
      expected_output: expected_output,
      userName:userName,
      problem_level: problem_level,
    });

    console.log("Full Backend Response:", response.data); // Debugging

    // Check if output exists before trimming
    const executedOutput = response.data.output.trim();
    const runtime = response.data.runTime;

    console.log("Expected Output:", expected_output);
    console.log("Executed Output:", executedOutput);
    console.log("Runtime:", runtime);

    setOutput(executedOutput);
    setRunTime(runtime);

    console.log("Executed Output Type:", typeof executedOutput, executedOutput);
    console.log("Expected Output Type:", typeof expected_output, expected_output);

    // Normalize output before comparison
    if (
      executedOutput.replace(/\s/g, "") === expected_output.replace(/\s/g, "")
    ) {
      setStatus("Success ✅");
     
    } else {
      setStatus("Failed ❌");
    }
  } catch (error) {
    console.error("Error executing code:", error);
    setOutput("Error executing code in front end");
    setStatus("Failed ❌");
  }
};


  return (
    <div className="leetcode-container">
      {/* Left Panel - Problem Statement */}
      <div className="left-panel">
        {problem ? (
          <>
          <div className="main"><h3><strong>{problem.problem_id}.{problem.name}</strong></h3>
          <div className="difficulty">
            Difficulty:{problem.level_of_problem}
          </div>
          </div>
            
            <br />
            <p>DESCRIPTION: <br /><br />{problem.description}</p><br /> 
            <p><strong>Input:</strong> <br />{problem.test_case_1}</p>
            <p><strong>Output:</strong><br />{problem.output_1}</p>
          </>
        ) : (
          <p>Loading problem details...</p>
        )}
      </div>

      {/* Right Panel - Code Editor & Output */}
      <div className="right-panel">
        
        <div className="status-bar">
          <div className="language-selector">
          <label>Language: </label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
        </div>
          <h5>Status: {status}</h5>
          <h5>Run Time: {runtime} </h5>
          <button className="run-btn" onClick={Analyze}>Analyze Code</button>
          {error && <p className="error">{error}</p>}
      {/* <pre className="output">{output}</pre> */}
      
      {/* Analysis Pop-up */}
      {showAnalysis && (
        <div className="analysis-popup">
          <div className="analysis-content">
            <h3>Analysis Result</h3>
            <p>{analysisResult}</p>
            <button className="run-btn" onClick={() => setShowAnalysis(false)}>Close</button>
          </div>
        </div>
      )}
      <button className="run-btn" onClick={()=>setShowAnalysis(!showAnalysis)}>SHOW </button>
        </div>



        {/* Code Editor */}
        <div className="editor-section">
          <CodeMirror
            value={code}
            height="490px"
            extensions={[getLanguageExtension()]}
            theme={dracula}
            onChange={(value) => setCode(value)}
          />
          <button className="run-btn" onClick={runCode}>Run Code</button>
        </div>

        {/* Output Section (Dynamic Height) */}
        <div className="output-section">
      <h2 className="test-result-title">✅ Test Result</h2>
      <table className="test-cases-table">
        <thead>
          <tr>
            <th>Test Case</th>
            <th>Input</th>
            <th>Expected Output</th>
            <th>Executed Output</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Test Case 1</td>
            <td>{problem?.test_case_1}</td>
            <td>{problem?.output_1}</td>
            <td className="executed-output">{output || "..."}</td>
          </tr>
          {/* Additional test cases can be added similarly */}
        </tbody>
      </table>
    </div>
      </div>
    </div>
  );
};

export default CodeEditorPage;
