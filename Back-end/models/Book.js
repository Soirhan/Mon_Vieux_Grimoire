const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String }, // URL vers l'image stockée
  userId: { type: String, required: true } // pour lier le livre à l'utilisateur
});

module.exports = mongoose.model('Book', bookSchema);
