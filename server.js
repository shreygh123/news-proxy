import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());

const BASE_URL = "https://newsapi.org/v2/top-headlines";

app.get("/api/news", async (req, res) => {
    // ✅ CORS HEADERS (MANDATORY)
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
    // ✅ Handle preflight
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

  try {
    const {
      country = "us",
      category = "general",
      page = 1,
      pageSize = 8
    } = req.query;

    const url = `${BASE_URL}?country=${country}&category=${category}&page=${page}&pageSize=${pageSize}&apiKey=${process.env.NEWS_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "ok") {
      return res.status(400).json({
        error: true,
        message: data.message || "Failed to fetch news"
      });
    }

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Internal Server Error"
    });
  }
});

app.get("/", (req, res) => {
  res.send("News API Proxy is running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
