const express = require('express');
const ping = require('ping');

const app = express();
const PORT = process.env.PORT || 3000;

// URL ที่ต้องการตรวจสอบ
const websites = [
  'https://knightnum.online',
  'https://nas.knightnum.online',
  'https://owncloud.knightnum.online',
  'https://jellyfin.knightnum.online',
  'https://owncloud.knightnum.online', // ซ้ำ
  'knightnum.tplinkdns.com'            // Ping domain
];

// ฟังก์ชันสำหรับเช็คสถานะ Ping
async function checkPing(host) {
  try {
    const res = await ping.promise.probe(host, {
      timeout: 5, // 5 seconds timeout
      extra: ['-i', '1'], // ส่งข้อมูลแบบ ICMP
    });
    return res.alive ? 'up' : 'down';
  } catch (error) {
    return 'down';
  }
}

app.get('/check', async (req, res) => {
  try {
    const results = await Promise.all(websites.map(async (website) => {
      let httpStatus = 'down';
      let pingStatus = 'down';

      if (website.startsWith('http')) {
        // เช็ค HTTP status สำหรับเว็บที่เป็น URL
        try {
          const response = await fetch(website, { timeout: 5000 });
          httpStatus = response.ok ? 'up' : 'down';
        } catch (error) {
          httpStatus = 'down';
        }
      } else {
        // เช็คสถานะ Ping สำหรับโดเมน
        pingStatus = await checkPing(website);
      }

      return {
        url: website,
        httpStatus: httpStatus,
        pingStatus: pingStatus
      };
    }));

    res.json(results);
  } catch (error) {
    res.status(500).send('Error checking the websites');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
