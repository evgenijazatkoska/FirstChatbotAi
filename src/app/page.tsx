// "use client";

// import { useState, useEffect, useRef } from "react";

// interface Message {
//   sender: "user" | "gemini";
//   text: string;
// }

// export default function Home() {
//   const [query, setQuery] = useState<string>("");
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [isTyping, setIsTyping] = useState<boolean>(false);
//   const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
//   const chatRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
    
//     const savedTheme = localStorage.getItem("theme");
//     if (savedTheme === "light") {
//       document.body.classList.remove("dark");
//       document.body.classList.add("light");
//       setIsDarkMode(false);
//     } else {
//       document.body.classList.add("dark");
//       setIsDarkMode(true);
//     }

   
//     const savedMessages = localStorage.getItem("chatHistory");
//     if (savedMessages) {
//       setMessages(JSON.parse(savedMessages));
//     }
//   }, []);

//   useEffect(() => {
   
//     localStorage.setItem("chatHistory", JSON.stringify(messages));

   
//     if (chatRef.current) {
//       chatRef.current.scrollTop = chatRef.current.scrollHeight;
//     }
//   }, [messages]);

//   async function askGemini() {
//     if (!query.trim()) return;

//     const newMessage: Message = { sender: "user", text: query };
//     const updatedMessages = [...messages, newMessage];

//     setMessages(updatedMessages);
//     setQuery("");
//     setIsTyping(true);

//     const res = await fetch("/api/gemini", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ messages: updatedMessages }),
//     });

//     const data = await res.json();
//     setIsTyping(false);

//     const geminiResponse: Message = { sender: "gemini", text: data.response || "No response" };
//     setMessages([...updatedMessages, geminiResponse]);
//   }

//   function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       askGemini();
//     }
//   }

//   function toggleTheme() {
//     if (isDarkMode) {
//       document.body.classList.remove("dark");
//       document.body.classList.add("light");
//       localStorage.setItem("theme", "light");
//     } else {
//       document.body.classList.remove("light");
//       document.body.classList.add("dark");
//       localStorage.setItem("theme", "dark");
//     }
//     setIsDarkMode(!isDarkMode);
//   }

//   function clearChat() {
//     setMessages([]);
//     localStorage.removeItem("chatHistory");
//   }

//   return (
//     <div className="mainBox">
//       <h1>ChatOrbit</h1>

//       {/* Chat History */}
//       <div className="chat-container" ref={chatRef}>
//         {messages.length === 0 && (
//           <p className="chat-placeholder">Ask me anything... even why the sky is blue!</p>
//         )}

//         {messages.map((msg, index) => (
//           <div key={index} className={`message ${msg.sender}`}>
//             {msg.text}
//           </div>
//         ))}

//         {isTyping && <p className="typing">Gemini is typing...</p>}
//       </div>

//       <input
//         type="text"
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//         onKeyDown={handleKeyDown}
//         placeholder="Ask something..."
//       />
//       <button className="button-52" onClick={askGemini}>Send</button>

//       {/* Toggle & Clear Chat Buttons */}
//       <div className="button-group">
//         <button className="button-52 toggle-mode" onClick={toggleTheme}>
//           {isDarkMode ? "Light Mode" : "Dark Mode"}
//         </button>
//         <button className="button-52 clear-chat" onClick={clearChat}>
//           Clear Chat
//         </button>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState, useEffect, useRef } from "react";

interface Message {
  sender: "user" | "gemini";
  text: string;
}

export default function Home() {
  const [query, setQuery] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [lastUserMessage, setLastUserMessage] = useState<string>("");  // Track the last user message
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      document.body.classList.remove("dark");
      document.body.classList.add("light");
      setIsDarkMode(false);
    } else {
      document.body.classList.add("dark");
      setIsDarkMode(true);
    }

    const savedMessages = localStorage.getItem("chatHistory");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages));

    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  async function askGemini() {
    if (!query.trim()) return;

    const newMessage: Message = { sender: "user", text: query };
    setLastUserMessage(query);  // Save the last message sent by the user
    const updatedMessages = [...messages, newMessage];

    setMessages(updatedMessages);
    setQuery("");
    setIsTyping(true);

    const res = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: updatedMessages }),
    });

    const data = await res.json();
    setIsTyping(false);

    const geminiResponse: Message = { sender: "gemini", text: data.response || "No response" };
    setMessages([...updatedMessages, geminiResponse]);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      askGemini();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setQuery(lastUserMessage);  // When ArrowUp is pressed, paste the last message
    }
  }

  function toggleTheme() {
    if (isDarkMode) {
      document.body.classList.remove("dark");
      document.body.classList.add("light");
      localStorage.setItem("theme", "light");
    } else {
      document.body.classList.remove("light");
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setIsDarkMode(!isDarkMode);
  }

  function clearChat() {
    setMessages([]);
    localStorage.removeItem("chatHistory");
  }

  return (
    <div className="mainBox">
      <h1>ChatOrbit</h1>

      {/* Chat History */}
      <div className="chat-container" ref={chatRef}>
        {messages.length === 0 && (
          <p className="chat-placeholder">Ask me anything... even why the sky is blue!</p>
        )}

        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}

        {isTyping && <p className="typing">Gemini is typing...</p>}
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}  // Listen for "ArrowUp" key here
        placeholder="Ask something..."
      />
      <button className="button-52" onClick={askGemini}>Send</button>

      {/* Toggle & Clear Chat Buttons */}
      <div className="button-group">
        <button className="button-52 toggle-mode" onClick={toggleTheme}>
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>
        <button className="button-52 clear-chat" onClick={clearChat}>
          Clear Chat
        </button>
      </div>
    </div>
  );
}
