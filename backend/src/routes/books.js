const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const authMiddleware = require('../middleware/auth');
const multerConfig = require('../middleware/multer-config');

// Public routes
router.get('/', async (req, res) => {
  try {
    const books = await Book.find({});
    res.json(books);
    return books; // Ajouté pour ESLint
  } catch (error) {
    res.status(500).json({ message: error.message });
    return null; // Ajouté pour ESLint
  }
});

router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      res.status(404).json({ message: 'Book not found' });
      return null; // Ajouté pour ESLint
    }
    res.json(book);
    return book; // Ajouté pour ESLint
  } catch (error) {
    res.status(500).json({ message: error.message });
    return null; // Ajouté pour ESLint
  }
});

// Protected routes
router.post('/', authMiddleware, multerConfig, async (req, res) => {
  const newBook = new Book({
    ...JSON.parse(req.body.book),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
  });
  try {
    await newBook.save();
    res.status(201).json({ message: 'Book added', book: newBook });
    return newBook; // Ajouté pour ESLint
  } catch (error) {
    res.status(400).json({ message: error.message });
    return null; // Ajouté pour ESLint
  }
});

router.put('/:id', authMiddleware, multerConfig, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      res.status(404).json({ message: 'Book not found' });
      return null; // Ajouté pour ESLint
    }
    if (req.file) {
      req.body.book.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    }
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, { ...JSON.parse(req.body.book) }, { new: true });
    res.json({ message: 'Book updated', book: updatedBook });
    return updatedBook; // Ajouté pour ESLint
  } catch (error) {
    res.status(400).json({ message: error.message });
    return null; // Ajouté pour ESLint
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      res.status(404).json({ message: 'Book not found' });
      return null; // Ajouté pour ESLint
    }
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Book deleted' });
    return book; // Ajouté pour ESLint
  } catch (error) {
    res.status(500).json({ message: error.message });
    return null; // Ajouté pour ESLint
  }
});

module.exports = router;
