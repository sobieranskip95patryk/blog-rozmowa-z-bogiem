const axios = require('axios');
const admin = require('firebase-admin');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin SDK (env or local file)
function initFirebaseAdmin() {
  if (admin.apps.length) return;

  const envCredentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const localCredentialsPath = path.resolve(__dirname, '..', 'config', 'firebase-service-account.json');

  const credentialsPath = envCredentialsPath || (fs.existsSync(localCredentialsPath) ? localCredentialsPath : null);
  if (!credentialsPath) {
    throw new Error(
      'Brak poświadczeń Firebase Admin. Ustaw `GOOGLE_APPLICATION_CREDENTIALS` albo umieść lokalnie `config/firebase-service-account.json` (plik nie może trafić do Gita).'
    );
  }

  const serviceAccount = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

initFirebaseAdmin();
const db = admin.firestore();

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function sendMessage() {
  const response = await axios.post(`${BASE_URL}/messages/send`, {
    userId: 'test-user',
    text: 'Test message',
    timestamp: Date.now()
  });
  return response.data;
}

async function checkOracleQueue(messageId) {
  const doc = await db.collection('oracle_queue').doc(messageId).get();
  return doc.exists ? doc.data() : null;
}

async function sendResponse({ userId, conversationId, messageId }) {
  const response = await axios.post(`${BASE_URL}/messages/respond`, {
    userId,
    conversationId,
    messageId,
    responseText: 'Test response',
    timestamp: Date.now()
  });
  return response.data;
}

async function checkMessageStatus(messageId) {
  const doc = await db.collection('oracle_queue').doc(messageId).get();
  return doc.exists ? doc.data().status : null;
}

async function checkMessagesCollection(messageId) {
  const snapshot = await db.collection('messages').where('message_id', '==', messageId).get();
  return snapshot.empty ? null : snapshot.docs[0].data();
}

(async () => {
  try {
    console.log('1. Sending message...');
    const message = await sendMessage();
    console.log('Message sent:', message);

    assert(message.messageId, 'Brak messageId w odpowiedzi /messages/send');
    assert(message.conversationId, 'Brak conversationId w odpowiedzi /messages/send');

    console.log('2. Checking oracle_queue...');
    const queueData = await checkOracleQueue(message.messageId);
    assert(queueData, 'Message not found in oracle_queue');
    console.log('Message found in oracle_queue:', queueData);

    console.log('3. Sending response...');
    const response = await sendResponse({
      userId: 'test-user',
      conversationId: message.conversationId,
      messageId: message.messageId
    });
    console.log('Response sent:', response);

    console.log('4. Checking message status...');
    const status = await checkMessageStatus(message.messageId);
    assert.strictEqual(status, 'answered', 'Message status not updated to answered');
    console.log('Message status updated to answered');

    console.log('5. Checking messages collection...');
    const messageData = await checkMessagesCollection(message.messageId);
    assert(messageData, 'Response not found in messages collection');
    console.log('Response found in messages collection:', messageData);

    console.log('All tests passed! 🎉');
  } catch (error) {
    console.error('Test failed:', error);
  }
})();