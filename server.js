const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { generateLink } = require('./linkService');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Main Route
app.post('/generate-link', (req, res, next) => {
    try {
        const { type, payload } = req.body;

        if (!type) {
            return res.status(400).json({
                success: false,
                message: 'Link type is required'
            });
        }

        const link = generateLink(type, payload);

        res.json({
            success: true,
            link: link
        });
    } catch (error) {
        // Pass to error handler
        next(error);
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(400).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

app.listen(PORT, () => {
    console.log(`Link Service running on port ${PORT}`);
});

/*
 * Example Usage:
 * 
 * curl -X POST http://localhost:3000/generate-link \
 * -H "Content-Type: application/json" \
 * -d '{
 *   "type": "invitation",
 *   "payload": { "eventId": "12345" }
 * }'
 * 
 */
