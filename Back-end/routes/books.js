const express = require('express');
const router = express.Router();
const booksCtrl = require('../controllers/books');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// Route publique pour lister tous les livres
router.get('/', booksCtrl.getAllBooks);

// Route publique pour voir un livre par ID
router.get('/:id', booksCtrl.getOneBook);

// Routes protégées
router.post('/', auth, multer, booksCtrl.createBook);
router.put('/:id', auth, multer, booksCtrl.modifyBook);
router.delete('/:id', auth, booksCtrl.deleteBook);

module.exports = router;
