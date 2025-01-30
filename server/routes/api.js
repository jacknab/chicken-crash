import express from 'express';

const router = express.Router();

// Game state storage
const balances = new Map();
const history = new Map();

// Balance routes
router.get('/balance/:userId', (req, res) => {
  const { userId } = req.params;
  const balance = balances.get(userId) || { balance: 1000 }; // Default balance
  res.json(balance);
});

router.get('/history/:userId', (req, res) => {
  const { userId } = req.params;
  const userHistory = history.get(userId) || [];
  res.json(userHistory);
});

export { router as apiRouter, balances, history };
