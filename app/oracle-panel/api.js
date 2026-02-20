import { doc, updateDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase-config';

// API helper to send a response
export const sendResponse = async ({ userId, conversationId, messageId, responseText, timestamp }) => {
  try {
    // Update the original message in Firestore
    const messageRef = doc(db, `conversations/${conversationId}/messages/${messageId}`);
    await updateDoc(messageRef, {
      answered_by: 'admin',
      response_time: timestamp
    });

    // Add the admin's response as a new message
    const messagesRef = collection(db, `conversations/${conversationId}/messages`);
    await addDoc(messagesRef, {
      sender: 'oracle',
      text: responseText,
      timestamp,
      emotion: null,
      topic: null,
      ai_analysis: null,
      answered_by: null,
      response_time: null
    });

    // Update the Oracle queue entry
    const queueRef = doc(db, `oracle_queue/${messageId}`);
    await updateDoc(queueRef, {
      status: 'answered'
    });
  } catch (error) {
    console.error('Error in sendResponse API:', error);
    throw error;
  }
};