const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

const db = admin.firestore();

// POST /messages/send
router.post('/send', async (req, res) => {
  try {
    const { userId } = req.body;
    const text = req.body.text ?? req.body.message;
    const timestamp = req.body.timestamp
      ? admin.firestore.Timestamp.fromMillis(Number(req.body.timestamp))
      : admin.firestore.Timestamp.now();

    if (!userId || !text) {
      return res.status(400).json({ error: 'Missing required fields: userId, text/message' });
    }

    // Reference to the user's conversation
    const conversationRef = db.collection('conversations').doc(userId);
    const messagesRef = conversationRef.collection('messages');

    // Add message to Firestore
    const messageData = {
      sender: 'user',
      text,
      timestamp,
      emotion: null, // Placeholder for AI analysis
      topic: null,   // Placeholder for AI analysis
      ai_analysis: null,
      answered_by: null,
      response_time: null
    };

    const messageDoc = await messagesRef.add(messageData);

    // Add to Oracle queue
    const oracleQueueRef = db.collection('oracle_queue');
    const queueData = {
      conversation_id: conversationRef.id,
      user_id: userId,
      message_id: messageDoc.id,
      text,
      timestamp,
      emotion: null, // Placeholder for AI analysis
      topic: null,   // Placeholder for AI analysis
      summary: null, // Placeholder for AI analysis
      ai_suggestions: [],
      priority: 'normal',
      status: 'waiting'
    };

    // Ustawiamy ID dokumentu w kolejce równe message_id, żeby łatwo aktualizować status.
    await oracleQueueRef.doc(messageDoc.id).set(queueData);

    res.status(200).json({
      message: 'Message sent and added to Oracle queue.',
      conversationId: conversationRef.id,
      messageId: messageDoc.id
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message.' });
  }
});

module.exports = router;