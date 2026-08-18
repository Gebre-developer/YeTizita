import React, { useState } from 'react';

function AiAssistant() {
  const [messages, setMessages] = useState([
    { text: "Hello! Ask me any coding question or request a review test challenge.", isAi: true }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput("");
    
    // 1. Add user message to UI chat feed
    setMessages((prev) => [...prev, { text: userMessage, isAi: false }]);
    setLoading(true);

    try {
      // 2. Fire the post request payload directly to your local node proxy
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage }), 
      });

      const data = await response.json();
      console.log("Frontend received response object payload:", data);
      
      // 3. Drill down into the custom text key parameter safely
      if (response.ok && data.text) {
        setMessages((prev) => [...prev, { text: data.text, isAi: true }]);
      } else {
        setMessages((prev) => [
          ...prev, 
          { text: `Error: ${data.error || 'Invalid API layout response structure'}`, isAi: true }
        ]);
      }
    } catch (error) {
      console.error("Frontend Crash Log Details:", error);
      setMessages((prev) => [
        ...prev, 
        { text: "Network connection lost to Node.js proxy. Verify terminal processes are running.", isAi: true }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hub-chat-wrapper">
      <div className="glass-card hub-chat-card">
        <h2 className="hub-chat-title">🇪🇹 Ethiopian Learning Hub AI Assistant</h2>
        
        {/* Chat window display container panel */}
        <div className="hub-chat-feed custom-scrollbar">
          {messages.map((msg, idx) => (
            <div key={idx} className={`hub-msg-row ${msg.isAi ? 'hub-msg-ai' : 'hub-msg-user'}`}>
              <div 
                className={`hub-msg-bubble ${msg.isAi ? 'bubble-ai' : 'bubble-user'}`}
                style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="hub-chat-loading">
              <span>●</span> System generates explanation tracks...
            </div>
          )}
        </div>

        {/* Input submission task elements form */}
        <form onSubmit={handleSendMessage} className="hub-chat-form">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a technical or programming question..." 
            className="glass-input hub-chat-input"
            disabled={loading}
          />
          <button type="submit" className="hub-chat-btn" disabled={loading}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default AiAssistant;
