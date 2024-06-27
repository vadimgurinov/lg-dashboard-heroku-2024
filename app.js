const express = require('express');
const path = require('path');
const basicAuth = require('express-basic-auth');

const app = express();
const port = process.env.PORT || 4000; // Updated port configuration

// Function to authenticate users
const myAuthorizer = (username, password) => {
    const userMatches = basicAuth.safeCompare(username, 'lg');
    const passwordMatches = basicAuth.safeCompare(password, 'Lionsoul_2022');
    return userMatches & passwordMatches;
};

// Middleware for basic authentication
const authMiddleware = basicAuth({
    authorizer: myAuthorizer,
    challenge: true,
    realm: 'MyApplication'
});

app.use(express.json()); 

// Serve static files (CSS, JS, images)
app.use(express.static('public'));

// Use authentication middleware on these routes
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

app.get('/prices', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'prices.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`); // Log message to confirm port binding
});