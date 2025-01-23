const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname))); // Serve static files from the root directory

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html")); // Serve the index.html directly from the root
});

app.get("/extract", async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).send("URL is required");
  }

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    $("script, style, iframe, nav, footer, header, a").remove();

    const content = [];
    $("body *").each((i, el) => {
      const tagName = $(el).prop("tagName").toLowerCase();

      if (["p", "h1", "h2", "h3", "h4", "h5", "h6"].includes(tagName)) {
        const text = $(el).text().trim();
        if (text) content.push({ type: "text", value: text });
      }

      if (tagName === "img") {
        const src = $(el).attr("src");
        if (src) content.push({ type: "image", value: new URL(src, url).href });
      }
    });

    res.json({ content });
  } catch (error) {
    console.error("Error fetching the webpage:", error);
    res.status(500).send("Error extracting content");
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
