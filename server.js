const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// รายชื่อเว็บที่ต้องการตรวจสอบ
const websites = [
  'https://knightnum.online',
  'https://nas.knightnum.online',
  'https://owncloud.knightnum.online',
  'https://jellyfin.knightnum.online',
];

app.get('/check', async (req, res) => {
  try {
    // เช็คสถานะทั้งหมดพร้อมกัน
    const results = await Promise.all(websites.map(async (website) => {
      try {
        const response = await fetch(website, { timeout: 5000 });
        return { url: website, status: response.ok ? 'up' : 'down' };
      } catch (error) {
        return { url: website, status: 'down' };
      }
    }));

    // ส่งข้อมูลผลลัพธ์ทั้งหมด
    res.json(results);
  } catch (error) {
    res.status(500).send('Error checking the websites');
  }
});

app.get('/', (req, res) => {
  res.send('Website Checker API');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
