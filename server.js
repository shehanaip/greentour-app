// Load environment variables from config.env
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');
const app = require('./app'); // Import the app instance

// Error handling for uncaught exceptions
process.on('uncaughtException', err => {
  console.error('Uncaught Exception! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});


const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('DB connection successful'))
  .catch(err => console.error('DB connection error:', err));

// Start the server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', err => {
  console.error('Unhandled Rejection! Shutting down...');
  console.error(err);
  server.close(() => {
    process.exit(1);
  });
});

