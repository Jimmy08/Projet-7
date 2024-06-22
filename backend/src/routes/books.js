const express = require('express');
const router = express.Router();

// Route GET pour les livres
router.get('/', (req, res) => {
  res.json({ message: 'Liste des livres' });
});

// Route POST pour ajouter un nouveau livre
router.post('/', (req, res) => {
  const newBook = req.body;
  res.status(201).json({ message: 'Livre ajouté', book: newBook });
});

module.exports = router;
