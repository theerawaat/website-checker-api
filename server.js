const express = require('express');
const fetch = require('node-fetch');
const net = require('net');

const app = express();
const PORT = process.env.PORT || 3000;

// รายชื่อเว็บที่ต้องการตรวจสอบ
const websites = [
  'https://knightnum.online',
  'https://nas.knightnum.online',
  'https://owncloud.knightnum.online',
  'https://jellyfin.knightnum.online',
  'https://knightnum.tplinkdns.com'     // สำหรับการ ping ด้วย TCP
];

// ฟังก์ชันสำหรับเช็ค TCP Socket (เหมือนกับการ Ping)
function checkPing(host, port = 80) {
  return new Promise((resolve, reject) => {
    const socket = new net.Socket();
    socket.setTimeout(5000); // 5 seconds timeout

    socket.on('connect', () => {
      socket.end(); // เชื่อมต่อสำเร็จแล้วปิด
      resolve(true);
    });

    socket.on('timeout', () => {
      socket.destroy();
      reject(new Error('timeout'));
    });

    socket.on('error', (err) => {
      reject(err);
    });

    socket.connect(port, host);
  });
}

app.get('/check', async (req, res) => {
  try {
    const results = await Promise.all(websites.map(async (website) => {
      const url = new URL(website);
      const host = url.hostname;
      const port = url.protocol === 'https:' ? 443 : 80;

      let httpStatus = 'down';
      let pingStatus = 'down';

      try {
        // เช็ค HTTP Status
        const response = await fetch(website, { timeout: 5000 });
        httpStatus = response.ok ? 'up' : 'down';
      } catch (error) {
        httpStatus = 'down';
      }

      try {
        // เช็ค TCP Ping
        pingStatus = await checkPing(host, port) ? 'up' : 'down';
      } catch (error) {
        pingStatus = 'down';
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

app.get('/', (req, res) => {
  res.send('Website Checker API');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
