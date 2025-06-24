const express = require("express");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3000;

const websites = [
  { url: "https://knightnum.online" },
  { url: "https://nas.knightnum.online" },
  { url: "https://owncloud.knightnum.online" },
  { url: "https://jellyfin.knightnum.online" },
];

app.get("/check", async (req, res) => {
  try {
    let status = [];

    for (let website of websites) {
      // ตรวจสอบ HTTP status
      const httpStatus = await axios
        .get(website.url)
        .then((response) => {
          return response.status === 200 ? "up" : "down";
        })
        .catch(() => "down");

      status.push({
        url: website.url,
        httpStatus: httpStatus,
      });
    }

    res.json(status);
  } catch (error) {
    res.status(500).send("Error checking websites status.");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
