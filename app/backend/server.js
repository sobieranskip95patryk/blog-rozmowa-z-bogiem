const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize Firebase Admin SDK
const serviceAccount = require('../../config/firebase-service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://your-database-name.firebaseio.com'
});

const db = admin.firestore();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Test Route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Routes
app.use('/messages', require('./routes/messages'));
app.use('/messages', require('./routes/respond'));
app.use('/oracle', require('./routes/oracle'));

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = { app, db };