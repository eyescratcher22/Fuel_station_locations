const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
app.use(cors()); 
app.use(express.json());

app.get("/extract", async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).send("URL is required");
  }

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

   
    const title = $("title").text();
    const paragraphs = $("p").map((i, el) => $(el).text()).get();
    const images = $("img").map((i, el) => $(el).attr("src")).get();

    res.json({
      title,
      paragraphs,
      images,
    });
  } catch (error) {
    console.error("Error fetching the webpage:", error);
    res.status(500).send("Error extracting content");
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
