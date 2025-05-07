require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas using URI in .env
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once('open', () => {
  console.log('✅ MongoDB connected');
});

// Route to save JSX components
app.post('/save-component', (req, res) => {
  const { filename, code } = req.body;
  const filePath = path.join(__dirname, 'src', 'components', filename);

  fs.writeFile(filePath, code, (err) => {
    if (err) {
      console.error('❌ Write error:', err);
      return res.status(500).json({ error: 'File write failed.' });
    }
    res.status(200).json({ success: true });
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 FoundryBot backend ready at http://localhost:${PORT}`));
