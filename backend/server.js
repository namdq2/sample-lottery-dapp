const express = require('express');
const cors = require('cors');
const lotteryRoutes = require('./routes/lottery');
const { setupEventListeners } = require('./services/blockchainService');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/lottery', lotteryRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}: http://localhost:${PORT}`);
  
  // Setup blockchain event listeners
  setupEventListeners();
});

module.exports = app;
