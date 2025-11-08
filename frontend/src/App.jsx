import { useState, useCallback } from 'react';
import './App.css';

function App() {
  const [sharedPrompt, setSharedPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePromptChange = useCallback((value) => {
    setSharedPrompt(value);
  }, []);

  const fetchOllamaResponse = useCallback(async (prompt) => {
    try {
      const encodedPrompt = encodeURIComponent(prompt);
      const res = await fetch(`http://localhost:8080/api/ollama/${encodedPrompt}`);

      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      return await res.text();
    } catch (error) {
      return `Error: ${error.message}`;
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!sharedPrompt.trim()) return;

    setLoading(true);
    setResponse('Loading...');

    const result = await fetchOllamaResponse(sharedPrompt);

    setResponse(result);
    setLoading(false);
  }, [sharedPrompt, fetchOllamaResponse]);

  return (
    <div className="app-container">
      <h1>Ollama Response Viewer</h1>

      <div className="shared-prompt-container">
        <div className="shared-prompt-area">
          <textarea
            placeholder="Enter a prompt..."
            value={sharedPrompt}
            onChange={(e) => handlePromptChange(e.target.value)}
            disabled={loading}
          />

          <button
            onClick={handleSubmit}
            disabled={loading || !sharedPrompt.trim()}
            className="submit-all-btn"
          >
            {loading ? 'Sending...' : 'Send to Ollama'}
          </button>
        </div>
      </div>

      <div className="model-box" style={{ borderColor: '#6798f5ff' }}>
        <h2 style={{ color: '#6798f5ff' }}>Ollama (Mistral 7B)</h2>

        <div className="response-area">
          <h3>Response:</h3>
          <div className="response-content">
            {response ? (
              <div className="response-text">{response}</div>
            ) : (
              <div className="placeholder-text">Response will appear here</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
