const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const booksRoutes = require('./routes/books');
const auth = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares généraux
app.use(express.json());
app.use(cors());

// Servir le dossier images
app.use('/images', express.static('images')); // <-- ici

// Routes publiques
app.use('/api/auth', authRoutes);

// Routes protégées
app.use('/api/books', booksRoutes);

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(err => console.error('Connexion à MongoDB échouée :', err));

// Lancement serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur backend lancé sur http://localhost:${PORT}`);
});
