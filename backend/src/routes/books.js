const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const authMiddleware = require('../middleware/auth');

// Route GET pour les livres (accessible à tous)
router.get('/', async (req, res) => {
  try {
    const books = await Book.find({});
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route POST pour ajouter un nouveau livre (authentification requise)
router.post('/', authMiddleware, async (req, res) => {
  const newBook = new Book(req.body);
  try {
    await newBook.save();
    res.status(201).json({ message: 'Livre ajouté', book: newBook });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route PUT pour mettre à jour un livre (authentification requise)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route DELETE pour supprimer un livre (authentification requise)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Livre supprimé' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
