const pino = require('pino');

// Create a basic Pino logger
const logger = pino({
  level: process.env.LOG_LEVEL || 'info', // Set log level via .env if needed
  transport: {
    target: 'pino-pretty', // Optional: makes logs readable in development
    options: {
      colorize: true
    }
  }
});

module.exports = logger;