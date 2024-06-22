require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Middleware de route (vous pouvez les séparer dans des fichiers distincts dans le dossier `routes`)
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Vérifiez le chemin du fichier books.js
const booksPath = path.resolve(__dirname, './src/routes/books.js');
console.log('Books path:', booksPath);
console.log('Books path exists:', require('fs').existsSync(booksPath));

// Exemple de route pour les livres
app.use('/api/books', require(booksPath));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
