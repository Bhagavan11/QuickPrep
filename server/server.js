const express = require('express');
const { Client } = require('pg');
const bcrypt = require('bcrypt');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios"); // Added for Judge0 API
require('dotenv').config();

const app = express();
app.use(express.urlencoded({ extended: true }));

// PostgreSQL client
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'quickprep',
  password: '9182003156',
  port: 5432,
});

client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('Database connection error:', err.stack));

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  cors({
    origin: 'http://localhost:3000',
     methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
    credentials: true,
  })
);

const JWT_SECRET = process.env.SECRATE_JWT;

// Routes
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await client.query(
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name',
      [email, hashedPassword, name]
    );
    const user = result.rows[0];
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    console.log("signup token", token);
    res.status(201).json({
      message: 'Signup successful',
      token,user
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).send('User not found');
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    const userName=user.name;
    if (isMatch) {
      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      console.log(token);
      res.status(200).json({
        message: 'Login successful',
        token,userName
      });
    } else {
      res.status(401).send('Incorrect password');
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send('Internal Server Error');
  }
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Token missing' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }
    req.user = decoded;
    next();
  });
}

app.get('/home', authenticateToken, (req, res) => {
  res.status(200).json({ user: req.user });
});

app.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.status(200).send('Logout successful');
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // Replace with your Gemini API key

// Chatbot API
app.post("/chat", async (req, res) => {
  console.log(req);
  
  try {
    const { query } = req.body;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(query);
    let response = await result.response.text();

    // Remove asterisks and trim response
    response = response.replace(/\*/g, "").trim();

    // Check if the response contains code snippets
    if (response.includes("```")) {
      const codeBlocks = response.match(/```([\s\S]*?)```/g); // Extract all code blocks
      if (codeBlocks) {
        codeBlocks.forEach((codeBlock) => {
          let formattedCode = codeBlock.replace(/```/g, "").trim();
          response = response.replace(codeBlock, `<pre><code class="highlight">${formattedCode}</code></pre>`);
        });
      }
    }

    res.json({ response });
  } catch (error) {
    console.error("Error generating response:", error);
    res.status(500).json({ error: "Failed to generate response" });
  }
});


// ======================= Judge0 API Route Added Below =======================
// Function to map languages to Judge0 IDs
const getLanguageId = (lang) => {
  const langIds = { cpp: 54, python: 71, java: 62, javascript: 63 };
  return langIds[lang] || 54;
};


// Code execution route
app.get('/problems', async (req, res) => {
  const username = req.query.userName;  // Get username from query params
  console.log("username is ", username);

  if (!username) {
    return res.status(400).send("Username is required");
  }

  try {
    const query = `
      SELECT 
        p.problem_id, 
        p.name, 
        p.level_of_problem, 
        CASE 
          WHEN usp.user_name IS NOT NULL THEN 'Solved ✅'  -- Updated column name here
          ELSE 'Unsolved ❌'
        END AS status
      FROM problems p
      LEFT JOIN user_solved_problems usp 
      ON p.problem_id = usp.problem_id 
      AND usp.user_name = $1;   -- Updated column name here
    `;

    const result = await client.query(query, [username]);
    console.log("Database Query Result:", result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).send('Server error');
  }
});

//fetch problem with paticular id to render in code editor
app.get("/problems/:id", async (req, res) => {
    const problemId = parseInt(req.params.id, 10); // Ensure it's an integer
    //console.log("Received request for problem ID:", problemId);

    try {
        const result = await client.query("SELECT * FROM problems WHERE problem_id = $1", [problemId]);

        //console.log("Database Query Result:", result.rows);
        if (result.rows.length === 0) {
            console.log("Problem not found in database");
            return res.status(404).json({ message: "Problem not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: err.message });
    }
});


// Analyze Code API Route
app.post("/analyze", async (req, res) => {
  try {
    const { description, code, language } = req.body;
    console.log("anlysis bot trigger")

    if (!description || !code || !language) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Optimized AI Prompt
    const prompt = `
      You are an expert software engineer. Given the following code snippet and problem description, analyze the efficiency and suggest an optimal algorithm.

      **Problem Description:**
      ${description}

      **Current Code (${language}):**
      \`\`\`${language}
      ${code}
      \`\`\`

      **Instructions:**
      - Identify any inefficiencies in the code.
      - Suggest an optimized algorithm with an explanation.
      - Explain the time and space complexity before and after optimization.
      - Provide a revised version of the code (if applicable).
    `;

    // Send the request to Gemini AI
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    let result = await model.generateContent(prompt);
    let response = result.response.text();
    response = response.replace(/\*/g, "").trim();

    // Check if the response contains code snippets
    if (response.includes("```")) {
      const codeBlocks = response.match(/```([\s\S]*?)```/g); // Extract all code blocks
      if (codeBlocks) {
        codeBlocks.forEach((codeBlock) => {
          let formattedCode = codeBlock.replace(/```/g, "").trim();
          response = response.replace(codeBlock, `<pre><code class="highlight">${formattedCode}</code></pre>`);
        });
      }
    }

    console.log("AI Analysis Response:", response);

    // Send analysis result to the chatbot
    res.json({ success: true, response: response });
  } catch (error) {
    console.error("Error analyzing code:", error);
    res.status(500).json({ error: "Failed to analyze the code" });
  }
});
app.get("/faq/:topic", async (req, res) => {
  const topic = req.params.topic;

  if (!topic) {
    return res.status(400).json({ error: "Topic must be selected" });
  }

  console.log("Topic selected:", topic);

  const prompt = `Generate a list of the most frequently asked and most important interview questions with answers for the topic: ${topic}.
These questions should help someone prepare for interviews at top companies like Amazon, Microsoft, Google, TCS, etc. Use real-world examples if possible and explain in detail assuming I know nothing about the topic.
Return the output strictly in JSON array format like:

[
  {
    "question": "What is ${topic}-related question 1?",
    "answer": "Answer to question 1."
  }
  ...
]

Respond with ONLY valid raw JSON array. Do NOT include any text before or after the array. Do NOT use markdown formatting. Do NOT include backticks. Use only plain ASCII double quotes (") for strings.
 Limit to 20 high-quality Q&A pairs.`

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);

    const candidate = result?.response?.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text;

    if (!text) {
      console.error("No valid text returned from Gemini");
      return res.status(500).json({ error: "Invalid response from Gemini API" });
    }

    let cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'")
      .replace(/\r/g, "")
      .trim();

    const jsonStart = cleaned.indexOf("[");
    const jsonEnd = cleaned.lastIndexOf("]");
    if (jsonStart === -1 || jsonEnd === -1) {
      console.error("Could not locate JSON brackets in Gemini response");
      return res.status(500).json({ error: "JSON structure missing in Gemini output" });
    }

    const jsonText = cleaned.substring(jsonStart, jsonEnd + 1);

    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch (e) {
      console.error("JSON Parse Error:", e.message);
      console.error("Bad JSON snippet:", jsonText.slice(0, 500)); // log part of the response
      return res.status(500).json({ error: "Failed to parse JSON from Gemini" });
    }

    const formatted = parsed.map(q => ({ ...q, showAnswer: false }));

    res.json(formatted);
  } catch (err) {
    console.error("Gemini API Error:", err.message || err);
    res.status(500).json({ error: "Gemini API call failed" });
  }
});

app.get("/faq/:company", async (req, res) => {
  const company = req.params.company;
  console.log("comapny is",company)

  if (!company) {
    return res.status(400).json({ error: "Topic must be selected" });
  }

  console.log("company selected:", company);

  const prompt = ` i am preparing the company ${company} i need to crack the intrview and intial round so i want ypu to Generate a list of the most frequently asked and most important interview questions with answers by company: ${company}.
These questions should help to crack the  technical intrview for the company ${company}. Use real-world examples if possible and explain in detail assuming I know nothing about the topic.
Return the output strictly in JSON array format like:

[
  {
    "question": "question 1?",
    "answer": "Answer to question 1."
  }
  ...
]

Respond with ONLY valid raw JSON array. Do NOT include any text before or after the array. Do NOT use markdown formatting. Do NOT include backticks. Use only plain ASCII double quotes (") for strings.
 Limit to 20 high-quality Q&A pairs.`

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);

    const candidate = result?.response?.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text;

    if (!text) {
      console.error("No valid text returned from Gemini");
      return res.status(500).json({ error: "Invalid response from Gemini API" });
    }

    let cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'")
      .replace(/\r/g, "")
      .trim();

    const jsonStart = cleaned.indexOf("[");
    const jsonEnd = cleaned.lastIndexOf("]");
    if (jsonStart === -1 || jsonEnd === -1) {
      console.error("Could not locate JSON brackets in Gemini response");
      return res.status(500).json({ error: "JSON structure missing in Gemini output" });
    }

    const jsonText = cleaned.substring(jsonStart, jsonEnd + 1);

    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch (e) {
      console.error("JSON Parse Error:", e.message);
      console.error("Bad JSON snippet:", jsonText.slice(0, 500)); // log part of the response
      return res.status(500).json({ error: "Failed to parse JSON from Gemini" });
    }

    const formatted = parsed.map(q => ({ ...q, showAnswer: false }));
    console.log("company questions",formatted)
    res.json(formatted);
  } catch (err) {
    console.error("Gemini API Error:", err.message || err);
    res.status(500).json({ error: "Gemini API call failed" });
  }
});


// Save note
app.post("/notes/save", async (req, res) => {
  const { username, topic, question, answer, note_type } = req.body;
  console.log(" igot it", username, topic, question, answer, note_type)

  if (!username || !note_type || (!question && !answer)) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await client.query(
      `INSERT INTO notes (username, topic, question, answer, note_type)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [username, topic, question, answer, note_type]
    );

    res.status(201).json({ message: "Note saved", note: result.rows[0] });
  } catch (err) {
    console.error("Error saving note:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


//fetch notes

app.get('/fetchNotes/:userName',async(req,res)=>{

  const username=req.params.userName;
  console.log("i am fetching notes of user",username)
  try {
    const Notes=await client.query(`select * from notes where username=$1`,[username])
    console.log("fetched Notes",Notes)
     return res.json(Notes)
  } catch (error) {
    console.log("error fetching notes",error)
    return res.json(error)
    
  }
  
 
})

app.delete('/deleteNote/:noteId', (req, res) => {
  const id = req.params.noteId;
  console.log("Note ID to be deleted:", id);

  try {
    client.query('DELETE FROM notes WHERE id = $1', [id], (err, result) => {
      if (err) {
        console.error('Error deleting note:', err);
        return res.status(500).send('Error deleting the note');
      }

      if (result.rowCount === 0) {
        return res.status(404).send('Note not found');
      }

      res.status(200).send('Note deleted successfully');
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).send('Server error');
  }
});






//judege api
const JUDGE0_API_URL = "https://judge0-ce.p.rapidapi.com/submissions";
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;; 
app.post("/execute", async (req, res) => {
  console.log("Received request to execute code");

  try {
    const { language, code, expected_output,userName,problem_id,problem_level } = req.body;
    console.log("Executing for Language:", language);
    console.log("Code:", code);
    console.log("i am username",userName)

    const languageMap = {
      javascript: 63, // Node.js
      python: 71,
      java: 62,
      cpp: 54,
    };

    if (!languageMap[language]) {
      return res.status(400).json({ error: "Unsupported language" });
    }

    const response = await axios.post(
      "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
      {
        source_code: code,
        language_id: languageMap[language],
        stdin: "",
      },
      {
        headers: {
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          "X-RapidAPI-Key": process.env.JUDGE0_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Judge0 Response:", response.data);

    const executed_output = response.data.stdout ? response.data.stdout.trim() : "";
    const runtime = response.data.time ? `${response.data.time} sec` : "N/A";
  console.log("i am here",runtime)
    let status = "";
     if (
      executed_output.replace(/\s/g, "") === expected_output.replace(/\s/g, "")
    ) {
     status="Accepted"
     
    } else {
      status="Not"
    }
    console.log(status)
    if (status === "Accepted") {
      const query = `
        INSERT INTO user_solved_problems (user_name, problem_id,difficulty)
        VALUES ($1, $2,$3)
        ON CONFLICT (user_name, problem_id) DO NOTHING;
      `;
      console.log("updating ....")
      await client.query(query, [userName, problem_id,problem_level]);
      console.log(`Problem ${problem_id} solved by User ID: ${userName}`);
    }

    res.json({ output: executed_output, runTime:runtime, status });
  } catch (error) {
    console.error("Error executing code:", error);
    res.status(500).json({ error: "Failed to execute code" });
  }
});
app.get("/api/user-progress/:userName", async (req, res) => {
  try {
    const userName = req.params.userName; // Get user_id from request query
    if (!userName) {
      return res.status(400).json({ error: "User  is required" });
    }

    // Fetch solved and total problems from the database
    const solvedQuery = `
      SELECT COUNT(*) AS solved, 
             SUM(CASE WHEN difficulty = 'easy' THEN 1 ELSE 0 END) AS easy, 
             SUM(CASE WHEN difficulty = 'medium' THEN 1 ELSE 0 END) AS medium, 
             SUM(CASE WHEN difficulty = 'hard' THEN 1 ELSE 0 END) AS hard 
      FROM user_solved_problemS 
      WHERE user_name = $1
    `;
    

    const totalQuery = `SELECT COUNT(*) AS total FROM problems`;
    

    const solvedResult = await client.query(solvedQuery, [userName]);
    const totalResult = await client.query(totalQuery);

    const { solved, easy, medium, hard } = solvedResult.rows[0];
    const total = totalResult.rows[0].total;
console.log("Total Query Result:", totalResult.rows);
console.log("Solved Query Result:", solvedResult.rows);
    res.json({
      solved: parseInt(solved) || 0,
      total: parseInt(total) || 0,
      categories: {
        easy: parseInt(easy) || 0,
        medium: parseInt(medium) || 0,
        hard: parseInt(hard) || 0,
      },
    });
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



// ======================= End of Judge0 API Route =======================

// job search api
app.get('/api/jobs', async (req, res) => {
  const options = {
    method: 'GET',
    url: 'https://jsearch.p.rapidapi.com/search',
    params: {
      query: 'software developer',
      page: '1',
      num_pages: '1',
    },
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
      'X-RapidAPI-Host': process.env.RAPIDAPI_HOST
    }
  };

  try {
    const response = await axios.request(options);
    const jobs = response.data.data; // Extract jobs array from API response

    const indianJobs = jobs.filter(job =>
      job.job_country && job.job_country.toLowerCase() === 'india'
    );

    if (indianJobs.length === 0) {
      res.json(jobs);
    } else {
      res.json(indianJobs); // Return filtered jobs
    }
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});


// latest tech neews api





app.get('/api/tech-news', async (req, res) => {
  try {
    const response = await axios.get('https://real-time-news-data.p.rapidapi.com/search', {
      params: {
        query: 'technology',
        limit: 10,
        time_published: 'anytime',
        country: 'US',
        lang: 'en'
      },
      headers: {
        'x-rapidapi-host': 'real-time-news-data.p.rapidapi.com',
        'x-rapidapi-key': 'c6b4d0aa1bmshb3e8253ceb063b9p1b281djsn8778a72cef72'
      }
    });

    // ✅ Send only the list of articles
    res.json(response.data.data);
  } catch (error) {
    console.error('❌ API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch tech news' });
  }
});








// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
