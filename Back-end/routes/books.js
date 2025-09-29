const express = require('express');
const router = express.Router();
const booksCtrl = require('../controllers/books');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.post('/', auth, multer, booksCtrl.createBook);
router.get('/', auth, booksCtrl.getAllBooks);
router.get('/:id', auth, booksCtrl.getOneBook);
router.put('/:id', auth, multer, booksCtrl.modifyBook);
router.delete('/:id', auth, booksCtrl.deleteBook);

module.exports = router;
