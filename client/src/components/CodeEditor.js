// import React, { useState } from "react";
// import Editor from "@monaco-editor/react";
// import axios from "axios";
// import { Button } from "@shadcn/ui";


// const languages = {
//   "C++": "cpp",
//   Python: "python",
//   Java: "java",
//   JavaScript: "javascript",
// };

// const CodeEditor = () => {
//   const [code, setCode] = useState("// Write your code here...");
//   const [language, setLanguage] = useState("C++");
//   const [output, setOutput] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleRun = async () => {
//     setLoading(true);
//     setOutput("Executing...");

//     try {
//       const response = await axios.post("http://localhost:5000/execute", {
//         language: languages[language],
//         code,
//       });

//       setOutput(response.data.output || "No output");
//     } catch (error) {
//       setOutput("Error executing code");
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="flex flex-col items-center p-4">
//       <h1 className="text-xl font-bold mb-4">Online Code Editor</h1>

//       <div className="mb-4">
//         <label className="mr-2">Select Language:</label>
//         <select
//           value={language}
//           onChange={(e) => setLanguage(e.target.value)}
//           className="p-2 border rounded-md"
//         >
//           {Object.keys(languages).map((lang) => (
//             <option key={lang} value={lang}>
//               {lang}
//             </option>
//           ))}
//         </select>
//       </div>

//       <Editor
//         height="400px"
//         width="80%"
//         theme="vs-dark"
//         defaultLanguage="cpp"
//         language={language.toLowerCase()}
//         value={code}
//         onChange={(value) => setCode(value)}
//       />

//       <Button className="mt-4" onClick={handleRun} disabled={loading}>
//         {loading ? "Running..." : "Run Code"}
//       </Button>

//       <div className="mt-4 w-3/4 p-4 bg-gray-800 text-white rounded-lg">
//         <h2 className="text-lg font-semibold">Output:</h2>
//         <pre className="whitespace-pre-wrap">{output}</pre>
//       </div>
//     </div>
//   );
// };

// export default CodeEditor;
