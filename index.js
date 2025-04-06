console.log('Starting the Fax App...');
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the "public" directory
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(PORT, (err) => {
  if (err) {
    console.error('Failed to start the server:', err);
    return;
  }
  console.log(`Server is running on http://localhost:${PORT}`);
});
