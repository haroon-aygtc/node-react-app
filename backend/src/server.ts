import app from './app.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend API server running on port ${PORT}`);
  console.log(`Backend API URL: http://localhost:${PORT}/api`);
  console.log(`WebSocket URL: ws://localhost:${PORT}`);
});
