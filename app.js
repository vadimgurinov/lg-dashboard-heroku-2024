const express = require('express');
const path = require('path');
const basicAuth = require('express-basic-auth');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 4000; // Port configuration for Heroku

// Function to authenticate users
const myAuthorizer = (username, password) => {
    const userMatches = basicAuth.safeCompare(username, process.env.BASIC_AUTH_USERNAME);
    const passwordMatches = basicAuth.safeCompare(password, process.env.BASIC_AUTH_PASSWORD);
    return userMatches & passwordMatches;
};

// Middleware for basic authentication
const authMiddleware = basicAuth({
    authorizer: myAuthorizer,
    challenge: true,
    realm: 'MyApplication'
});

app.use(express.json()); 

// Serve static files from the public directory
app.use(express.static('public'));

// Use authentication middleware on specified routes
app.use('/', authMiddleware);
app.use('/edit', authMiddleware);

// Serve index.html at root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Serve edit.html at /edit
app.get('/edit', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'edit.html'));
});

// Serve prices.html at /prices
app.get('/prices', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'prices.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`); // Confirmation of server running
});
