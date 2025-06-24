const express = require('express');
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 3000;

app.get('/check', async (req, res) => {
  const url = 'https://knightnum.online';  // URL ของเว็บไซต์ที่ต้องการตรวจสอบสถานะ

  try {
    const response = await fetch(url);
    if (response.ok) {
      res.send('Website is up!');
    } else {
      res.status(500).send('Website is down!');
    }
  } catch (err) {
    res.status(500).send('Error checking the website');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
