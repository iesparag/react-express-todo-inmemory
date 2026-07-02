// Minimal Express server for in-memory todo API scaffold
import express from 'express';
import cors from 'cors';

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

// Root route for health check
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Todo backend is running.' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
