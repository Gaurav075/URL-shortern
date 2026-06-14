import 'dotenv/config';
import express from 'express'; // <-- We need to bring express into this file
import app from './src/app.js';

const PORT = process.env.PORT || 3000;

// Tell the app to serve the frontend files BEFORE starting the server
app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});