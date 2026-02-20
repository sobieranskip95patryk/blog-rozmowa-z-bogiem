import React, { useState } from 'react';
import RealtimeQueue from './RealtimeQueue';
import { sendResponse } from './api'; // Import API helper for sending responses

const OraclePanel = () => {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [responseText, setResponseText] = useState('');

  const handleSelectMessage = (message) => {
    setSelectedMessage(message);
    setResponseText(''); // Clear response text when selecting a new message
  };

  const handleSendResponse = async () => {
    if (!selectedMessage || !responseText.trim()) {
      alert('Please select a message and write a response.');
      return;
    }

    try {
      await sendResponse({
        userId: selectedMessage.user_id,
        conversationId: selectedMessage.conversation_id,
        messageId: selectedMessage.id,
        responseText,
        timestamp: new Date().toISOString()
      });

      alert('Response sent successfully!');
      setSelectedMessage(null);
      setResponseText('');
    } catch (error) {
      console.error('Error sending response:', error);
      alert('Failed to send response.');
    }
  };

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      {/* Left Column: Message List */}
      <div style={{ flex: 1 }}>
        <h2>Oracle Queue</h2>
        <RealtimeQueue onSelectMessage={handleSelectMessage} />
      </div>

      {/* Right Column: Message Details and Response */}
      <div style={{ flex: 2 }}>
        {selectedMessage ? (
          <div>
            <h3>Message Details</h3>
            <p><strong>Text:</strong> {selectedMessage.text}</p>
            <p><strong>Emotion:</strong> {selectedMessage.emotion || 'N/A'}</p>
            <p><strong>Topic:</strong> {selectedMessage.topic || 'N/A'}</p>
            <p><strong>AI Suggestions:</strong></p>
            <ul>
              {selectedMessage.ai_suggestions && selectedMessage.ai_suggestions.length > 0 ? (
                selectedMessage.ai_suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))
              ) : (
                <li>No suggestions available.</li>
              )}
            </ul>

            <h3>Write a Response</h3>
            <textarea
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              rows={5}
              style={{ width: '100%' }}
            />
            <button onClick={handleSendResponse} style={{ marginTop: '10px' }}>
              Send Response
            </button>
          </div>
        ) : (
          <p>Select a message to view details and respond.</p>
        )}
      </div>
    </div>
  );
};

export default OraclePanel;