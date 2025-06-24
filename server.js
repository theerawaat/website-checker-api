const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// แก้ URL ตามเว็บที่คุณต้องการตรวจสอบ
const WEBSITE_URL = 'https://knightnum.online';

app.get('/check', async (req, res) => {
  try {
    const response = await fetch(WEBSITE_URL, { timeout: 5000 });
    if (response.ok) {
      res.send('Website is up!');
    } else {
      res.status(500).send('Website is down!');
    }
  } catch (error) {
    res.status(500).send('Error checking the website');
  }
});

app.get('/', (req, res) => {
  res.send('Website Checker API');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
