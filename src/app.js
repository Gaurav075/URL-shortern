import express from 'express'
import urlRoutes from './routes/urlRoutes.js'
import { getUrlByCode } from './services/urlServices.js'; // Adjust path if your folder is named differently

const app = express();
app.use(express.json());

// 1. Your API routes
app.use('/api', urlRoutes);

// 2. The Redirect Route! 
// This catches any root URL parameter (like /8rOrcN) and looks it up
app.get('/:code', async (req, res) => {
    try {
        const shortCode = req.params.code;
        
        // Fetch the original URL from Redis
        const originalUrl = await getUrlByCode(shortCode);

        if (originalUrl) {
            // If we found it, redirect the user's browser!
            return res.redirect(originalUrl);
        } else {
            // If it's not in Redis, show an error
            return res.status(404).send('<h1>404 - URL Not Found or Expired</h1>');
        }
    } catch (error) {
        console.error('Redirect Error:', error);
        return res.status(500).send('Internal Server Error');
    }
});

export default app;