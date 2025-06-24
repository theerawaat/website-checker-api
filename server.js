const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Helper function to check website status
async function checkWebsite(url) {
    try {
        const response = await axios.get(url);
        if (response.status >= 200 && response.status < 400) {
            return true; // Website is up
        } else {
            return false; // Website is down
        }
    } catch (error) {
        return false; // Website is down
    }
}

// Endpoint to check multiple websites
app.get('/check', async (req, res) => {
    const websites = [
        { url: 'https://knightnum.online', status: await checkWebsite('https://knightnum.online') },
        { url: 'https://nas.knightnum.online', status: await checkWebsite('https://nas.knightnum.online') },
        { url: 'https://owncloud.knightnum.online', status: await checkWebsite('https://owncloud.knightnum.online') },
        { url: 'https://jellyfin.knightnum.online', status: await checkWebsite('https://jellyfin.knightnum.online') },
    ];

    res.json(websites); // Return status as true/false for each website
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
