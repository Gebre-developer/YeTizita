import React, { useState } from 'react';
// 🎯 FIXED: Points accurately to your 'src/services' folder structure visible in your explorer tree
import { aiServices } from '../services'; 

function AiAssistant({ courseContext, currentActiveLesson }) {
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
    
    // 1. Add user message to UI chat feed instantly
    setMessages((prev) => [...prev, { text: userMessage, isAi: false }]);
    setLoading(true);

    try {
      // Convert UI messages state stack into historical message array blocks matching Gemini SDK inputs
      const structuredHistory = messages.slice(1).map(msg => ({
        sender: msg.isAi ? 'gemini' : 'user',
        text: msg.text
      }));

      // 2. Call your pre-configured service helper endpoint safely passing exactly 4 map array attributes
      const data = await aiServices.sendMessageToCopilot(
        userMessage,
        structuredHistory,
        courseContext || {},
        currentActiveLesson || {} 
      );

      console.log("Frontend received response object payload:", data);
      
      // 3. Extract custom AI message properties securely
      if (data && data.success && data.text) {
        setMessages((prev) => [...prev, { text: data.text, isAi: true }]);
      } else {
        setMessages((prev) => [
          ...prev, 
          { text: `Error: ${data.message || 'Invalid API layout response structure'}`, isAi: true }
        ]);
      }
    } catch (error) {
      console.error("Frontend Crash Log Details:", error);
      setMessages((prev) => [
        ...prev, 
        { text: "Failed to communicate with AI Assistant. Verify backend service status.", isAi: true }
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

        {/* Input submission form elements layout */}
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
