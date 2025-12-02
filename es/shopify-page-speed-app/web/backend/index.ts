import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Page Speed Optimizer App is running" });
});

// Webhook: App installed
app.post("/webhooks/app/installed", async (req, res) => {
  const shop = req.query.shop;
  console.log(`App installed on shop: ${shop}`);
  res.sendStatus(200);
});

// Webhook: App uninstalled
app.post("/webhooks/app/uninstalled", async (req, res) => {
  const shop = req.query.shop;
  console.log(`App uninstalled from shop: ${shop}`);
  res.sendStatus(200);
});

// API: Get page speed settings
app.get("/api/speed-settings", async (req, res) => {
  try {
    const settings = {
      enableImageOptimization: true,
      enableLazyLoading: true,
      enableCaching: true,
      imageQuality: 80,
      cacheExpiration: 3600,
      minifyCSS: true,
      minifyJS: true,
      deferNonCriticalCSS: true,
    };
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: "Failed to get settings" });
  }
});

// API: Update page speed settings
app.post("/api/speed-settings", async (req, res) => {
  try {
    const { settings } = req.body;
    // Save settings to database
    console.log("Settings updated:", settings);
    res.json({ success: true, message: "Settings saved successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update settings" });
  }
});

// API: Get page speed report
app.post("/api/analyze-page", async (req, res) => {
  try {
    const { url } = req.body;

    // This would integrate with PageSpeed Insights API or Lighthouse
    const report = {
      url,
      score: {
        performance: 85,
        accessibility: 90,
        seo: 100,
        bestPractices: 92,
      },
      metrics: {
        firstContentfulPaint: "1.2s",
        largestContentfulPaint: "2.4s",
        cumulativeLayoutShift: "0.05",
        timeToFirstByte: "0.3s",
      },
      suggestions: [
        "Optimize images - Use WebP format and serve responsive images",
        "Enable browser caching - Set Cache-Control headers",
        "Minify CSS and JavaScript files",
        "Defer non-critical CSS",
        "Use a CDN for faster asset delivery",
        "Implement lazy loading for images",
      ],
    };

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: "Failed to analyze page" });
  }
});

// API: Get speed metrics
app.get("/api/metrics", async (req, res) => {
  try {
    const metrics = {
      averagePageLoadTime: "2.1s",
      averagePageSize: "2.5 MB",
      averageRequestCount: 45,
      performance: 82,
      lastUpdated: new Date().toISOString(),
    };
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: "Failed to get metrics" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Page Speed Optimizer app running on port ${PORT}`);
  console.log(`📱 Available at: http://localhost:${PORT}`);
});
