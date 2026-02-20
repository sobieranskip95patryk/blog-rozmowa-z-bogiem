import React, { useEffect, useState } from 'react';
import { collection, query, where, orderBy, onSnapshot, limit as limitQuery } from 'firebase/firestore';
import { db } from '../firebase-config'; // Import Firebase config
import { ORACLE_QUEUE_REALTIME_LIMIT } from './constants';

const RealtimeQueue = ({ onSelectMessage, limit = ORACLE_QUEUE_REALTIME_LIMIT }) => {
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    // Query to fetch messages with status 'waiting'
    const queueRef = collection(db, 'oracle_queue');
    const q = query(
      queueRef,
      where('status', '==', 'waiting'),
      orderBy('timestamp', 'asc'),
      limitQuery(Number(limit) || ORACLE_QUEUE_REALTIME_LIMIT)
    );

    // Subscribe to Firestore snapshots
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedQueue = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setQueue(updatedQueue);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h2>Oracle Queue (Realtime)</h2>
      {queue.length === 0 ? (
        <p>No messages in the queue.</p>
      ) : (
        <ul>
          {queue.map((item) => (
            <li
              key={item.id}
              onClick={() => onSelectMessage?.(item)}
              style={{ cursor: onSelectMessage ? 'pointer' : 'default' }}
            >
              <strong>{item.text}</strong> <br />
              <small>Emotion: {item.emotion || 'N/A'}, Topic: {item.topic || 'N/A'}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RealtimeQueue;