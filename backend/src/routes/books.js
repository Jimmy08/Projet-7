const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

router.get('/', async (req, res) => {
  try {
    const books = await Book.find({});
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  const newBook = new Book(req.body);
  try {
    await newBook.save();
    res.status(201).json({ message: 'Livre ajouté', book: newBook });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
