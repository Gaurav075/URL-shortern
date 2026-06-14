import express from 'express';
import path from 'path';
import urlRoutes from './routes/urlRoutes.js';

// If your server crashed on the last attempt, change this path to exactly match where your file is!
// For example: import { getUrlByCode } from './services/urlServices.js';
import { getUrlByCode } from './urlServices.js'; 

const app = express();
app.use(express.json());

// 🟢 CRITICAL FIX: Serve the frontend files FIRST so the button works
app.use(express.static('public'));

// 🟢 Your API routes
app.use('/api', urlRoutes);

// 🔴 The Redirect Route (MUST BE LAST so it doesn't swallow script.js!)
app.get('/:code', async (req, res) => {
    try {
        const shortCode = req.params.code;
        const originalUrl = await getUrlByCode(shortCode);

        if (originalUrl) {
            return res.redirect(originalUrl);
        } else {
            return res.status(404).send('<h1>404 - URL Not Found or Expired</h1>');
        }
    } catch (error) {
        console.error('Redirect Error:', error);
        return res.status(500).send('Internal Server Error');
    }
});

export default app;