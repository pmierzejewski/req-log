const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();

// Middleware for parsing json bodies in POST requests
app.use(bodyParser.json());

// Log directory
const logDir = path.join(__dirname, "logs");

// Check if logs directory exists, if not create one
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Log file path
const logFile = path.join(logDir, "log.txt");

// POST /payment endpoint
app.post("/payment", (req, res) => {
  const now = new Date();

  const logEntry = `${now.toISOString()} - ${JSON.stringify(req.body)}\n`;

  fs.appendFile(logFile, logEntry, (err) => {
    if (err) {
      console.error(`Error writing to log file: ${err}`);
      res.status(500).send("Server Error");
    } else {
      res.status(200).send("Payment recorded successfully");
    }
  });
});

// Serve the log file directory
app.use("/logs", express.static(logDir));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
