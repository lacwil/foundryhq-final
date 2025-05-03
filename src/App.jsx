// src/App.jsx
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import "./App.css";

function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const handleGenerate = async () => {
    setResponse("Loading...");
    try {
      const res = await fetch("http://localhost:3000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      setResponse(data.result || "No result returned");
    } catch (err) {
      setResponse("Error: " + err.message);
    }
  };

  return (
    <div className="flex font-sans">
      <Sidebar />
      <main className="flex-1 bg-white h-screen overflow-y-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Ask FoundryBot</h1>
        <div className="flex flex-col space-y-4">
          <textarea
            className="w-full p-4 border rounded resize-none"
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt here..."
          />
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-fit"
            onClick={handleGenerate}
          >
            Generate
          </button>
          <div className="mt-4 whitespace-pre-wrap bg-gray-100 p-4 rounded min-h-[150px]">
            {response}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
