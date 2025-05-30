const fs = require("fs");
const path = require("path");

function logAction(action, userId) {
  const log = `[${new Date().toISOString()}] User ${userId}: ${action}\n`;
  const logPath = path.join(__dirname, "../logs/audit.log");
  fs.appendFileSync(logPath, log);
}

module.exports = { logAction };