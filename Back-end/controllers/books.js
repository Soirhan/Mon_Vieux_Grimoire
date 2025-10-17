const Book = require('../models/Book');
const fs = require('fs');
const jwt = require('jsonwebtoken');

// Créer un livre (protégé)
exports.createBook = (req, res, next) => {
  let bookObject = {};
  try {
    bookObject = req.body.book ? JSON.parse(req.body.book) : {};
  } catch (err) {
    return res.status(400).json({ message: 'JSON invalide dans req.body.book' });
  }

  // Vérification des champs obligatoires
  if (!bookObject.title || !bookObject.author || !req.userId) {
    return res.status(400).json({ message: 'Champs obligatoires manquants : title, author ou userId' });
  }

  // Conversion des nombres
  if (bookObject.year) bookObject.year = parseInt(bookObject.year, 10);
  if (bookObject.averageRating) bookObject.averageRating = parseInt(bookObject.averageRating, 10);

  const book = new Book({
    ...bookObject,
    userId: req.userId,
    imageUrl: req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : ''
  });

  book.save()
    .then(() => res.status(201).json({ message: 'Livre enregistré !', book }))
    .catch(error => res.status(400).json({ message: 'Erreur lors de la sauvegarde', error }));
};

// Récupérer tous les livres (publique)
exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then(books => {
      // Vérifie si utilisateur connecté pour indiquer propriétaire
      let userId = null;
      if (req.headers.authorization) {
        try {
          const token = req.headers.authorization.split(' ')[1];
          const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'RANDOM_SECRET_KEY');
          userId = decodedToken.userId;
        } catch {}
      }

      const booksWithOwner = books.map(book => {
        const bookObj = book.toObject();
        bookObj.isOwner = userId && userId === book.userId;
        return bookObj;
      });
      res.status(200).json(booksWithOwner);
    })
    .catch(error => res.status(400).json({ error }));
};

// Récupérer un livre par ID (publique)
exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (!book) return res.status(404).json({ message: 'Livre non trouvé' });

      let userId = null;
      if (req.headers.authorization) {
        try {
          const token = req.headers.authorization.split(' ')[1];
          const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'RANDOM_SECRET_KEY');
          userId = decodedToken.userId;
        } catch {}
      }

      const bookObj = book.toObject();
      bookObj.isOwner = userId && userId === book.userId;
      res.status(200).json(bookObj);
    })
    .catch(error => res.status(500).json({ error }));
};

// Modifier un livre (protégé)
exports.modifyBook = (req, res, next) => {
  let bookObject = {};
  try {
    bookObject = req.file
      ? { ...JSON.parse(req.body.book), imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` }
      : { ...req.body };
  } catch (err) {
    return res.status(400).json({ message: 'JSON invalide dans req.body.book' });
  }

  Book.updateOne({ _id: req.params.id, userId: req.userId }, { ...bookObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Livre modifié !' }))
    .catch(error => res.status(401).json({ error }));
};

// Supprimer un livre (protégé)
exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (!book) return res.status(404).json({ message: 'Livre non trouvé' });

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
