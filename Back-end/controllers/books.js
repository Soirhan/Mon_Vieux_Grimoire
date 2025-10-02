const Book = require('../models/Book');
const fs = require('fs');

// Créer un livre
exports.createBook = (req, res, next) => {
  let bookObject = {};
  try {
    bookObject = req.body.book ? JSON.parse(req.body.book) : req.body;
  } catch (err) {
    return res.status(400).json({ error: 'JSON invalide dans req.body.book' });
  }

  const book = new Book({
    ...bookObject,
    userId: req.userId,
    imageUrl: req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : ''
  });

  book.save()
    .then(() => res.status(201).json({ message: 'Livre enregistré !' }))
    .catch(error => res.status(400).json({ error }));
};

// Récupérer tous les livres
exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

// Récupérer un livre
exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
};

// Modifier un livre
exports.modifyBook = (req, res, next) => {
  const bookObject = req.file
    ? { ...JSON.parse(req.body.book), imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` }
    : { ...req.body };

  Book.updateOne({ _id: req.params.id, userId: req.userId }, { ...bookObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Livre modifié !' }))
    .catch(error => res.status(401).json({ error }));
};

// Supprimer un livre
exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (book.userId !== req.userId) {
        return res.status(401).json({ message: 'Non autorisé' });
      }
      if (book.imageUrl) {
        const filename = book.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Livre supprimé !' }))
            .catch(error => res.status(401).json({ error }));
        });
      } else {
        Book.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Livre supprimé !' }))
          .catch(error => res.status(401).json({ error }));
      }
    })
    .catch(error => res.status(500).json({ error }));
};
