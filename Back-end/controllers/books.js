const Book = require('../models/Book');
const fs = require('fs');

//  Créer un livre
exports.createBook = async (req, res, next) => {
  try {
    const bookObject = JSON.parse(req.body.book);

    delete bookObject._id;
    delete bookObject.userId;

    const book = new Book({
      ...bookObject,
      userId: req.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    // Calcul de la moyenne
    if (book.ratings && book.ratings.length > 0) {
      const sum = book.ratings.reduce((acc, r) => acc + r.grade, 0);
      book.averageRating = sum / book.ratings.length;
    } else {
      book.averageRating = 0;
    }

    await book.save();
    res.status(201).json({ message: 'Livre enregistré !' });
  } catch (error) {
    res.status(400).json({ error });
  }
};

//  Récupérer tous les livres
exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

//  Récupérer un livre par ID
exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
};

// Modifier un livre
exports.modifyBook = (req, res, next) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      }
    : { ...req.body };

  Book.updateOne(
    { _id: req.params.id, userId: req.userId },
    { ...bookObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: 'Livre modifié !' }))
    .catch(error => res.status(401).json({ error }));
};

//  Supprimer un livre
exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (book.userId !== req.userId) {
        return res.status(401).json({ message: 'Non autorisé' });
      }
      const filename = book.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Book.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Livre supprimé !' }))
          .catch(error => res.status(401).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

//  Noter un livre
exports.rateBook = async (req, res, next) => {
  try {
    const { rating } = req.body;

    const book = await Book.findOne({ _id: req.params.id });
    if (!book) return res.status(404).json({ message: 'Livre non trouvé' });

    // Vérifier si déjà noté
    const alreadyRated = book.ratings.find(r => r.userId === req.userId);
    if (alreadyRated) {
      return res.status(400).json({ message: 'Livre déjà noté par cet utilisateur' });
    }

    // Ajouter la note
    book.ratings.push({ userId: req.userId, grade: rating });

    // Recalcul moyenne
    const sum = book.ratings.reduce((acc, r) => acc + r.grade, 0);
    book.averageRating = sum / book.ratings.length;

    await book.save();
    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({ error });
  }
};
