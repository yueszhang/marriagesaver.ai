const express = require('express');
const bodyParser = require('body-parser');
const OpenAI = require('openai');

const app = express();
const port = process.env.PORT || 3000;

// Load environment variables
require('dotenv').config();

// Ensure the API key is set
if (!process.env.OPENAI_API_KEY) {
    console.error("Error: OPENAI_API_KEY is not set in the environment variables.");
    process.exit(1);
}

// Configure OpenAI API client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Route to handle chat messages
app.post('/chat', async (req, res) => {
    const { message } = req.body;

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: message }],
        });

        const botReply = response.choices[0].message.content;
        res.json({ reply: botReply });
    } catch (error) {
        console.error("Error processing the request:", error);
        res.status(500).send('Error processing your request.');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
