const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

const db = admin.firestore();

// GET /oracle/queue
router.get('/queue', async (req, res) => {
  try {
    const { status = 'waiting' } = req.query; // Default to 'waiting' if no status is provided

    const queueRef = db.collection('oracle_queue');
    const snapshot = await queueRef.where('status', '==', status).orderBy('timestamp', 'asc').get();

    if (snapshot.empty) {
      return res.status(200).json({ messages: [] });
    }

    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.status(200).json({ messages });
  } catch (error) {
    console.error('Error fetching Oracle queue:', error);
    res.status(500).json({ error: 'Failed to fetch Oracle queue.' });
  }
});

module.exports = router;