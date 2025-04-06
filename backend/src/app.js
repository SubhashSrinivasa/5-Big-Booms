import express from 'express';
import newsRoutes from './routes/newsRoutes.js';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Routes (mount under /api so endpoints are /api/news and /api/update-news)
app.use('/api', newsRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});