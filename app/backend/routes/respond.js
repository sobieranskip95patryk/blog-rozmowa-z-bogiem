const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

const db = admin.firestore();

// POST /messages/respond
router.post('/respond', async (req, res) => {
  try {
    const { userId, messageId } = req.body;
    const conversationId = req.body.conversationId ?? userId;
    const responseText = req.body.responseText ?? req.body.response;
    const timestamp = req.body.timestamp
      ? admin.firestore.Timestamp.fromMillis(Number(req.body.timestamp))
      : admin.firestore.Timestamp.now();

    if (!userId || !conversationId || !messageId || !responseText) {
      return res.status(400).json({
        error: 'Missing required fields: userId, conversationId (or userId), messageId, responseText/response'
      });
    }

    // Reference to the conversation and message
    const conversationRef = db.collection('conversations').doc(conversationId);
    const messageRef = conversationRef.collection('messages').doc(messageId);

    // Update the original message with response details
    await messageRef.update({
      answered_by: 'admin',
      response_time: timestamp
    });

    // Add the admin's response as a new message
    const responseMessage = {
      sender: 'oracle',
      text: responseText,
      timestamp,
      emotion: null, // Optional: Add AI analysis if needed
      topic: null,   // Optional: Add AI analysis if needed
      ai_analysis: null,
      answered_by: null,
      response_time: null
    };

    await conversationRef.collection('messages').add(responseMessage);

    // Update the Oracle queue entry
    await db.collection('oracle_queue').doc(messageId).set(
      {
        status: 'answered',
        answered_at: timestamp
      },
      { merge: true }
    );

    // Zapis do top-level `messages` (dla audytu i prostych testów)
    await db.collection('messages').add({
      user_id: userId,
      conversation_id: conversationId,
      message_id: messageId,
      response_text: responseText,
      timestamp
    });

    res.status(200).json({ message: 'Response recorded successfully.' });
  } catch (error) {
    console.error('Error recording response:', error);
    res.status(500).json({ error: 'Failed to record response.' });
  }
});

module.exports = router;