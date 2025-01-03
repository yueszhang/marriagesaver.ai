const express = require('express');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
const path = require('path')

const app = express();
const port = process.env.PORT || 3000;

// Load environment variables
require('dotenv').config();

//Delete after testing
console.log("Environment Variables:");
console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY || "Not found");
console.log("DATABASE_URL:", process.env.DATABASE_URL || "Not found");
console.log("CLERK_API_KEY:", process.env.CLERK_API_KEY || "Not found");

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
app.use(express.static(path.join(__dirname, 'public')));

// Route to handle chat messages
app.post('/chat', async (req, res) => {
    const apiKey = process.env.OPENAI_API_KEY; // Access directly within function
    const openai = new OpenAI({
        apiKey: apiKey,
    });

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: req.body.message }],
        });
        res.json({ reply: response.choices[0].message.content });
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).send('Error: Unable to Send Message');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

export default app;