const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Inscription
exports.signup = (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: 'Email et mot de passe requis !' });
  }

  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      return user.save();
    })
    .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
    .catch(error => {
      console.error('❌ Erreur signup:', error);
      res.status(400).json({ error });
    });
};

// Connexion
exports.login = (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: 'Email et mot de passe requis !' });
  }

  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ message: 'Utilisateur non trouvé !' });
      }
      return bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ message: 'Mot de passe incorrect !' });
          }

          //  Utiliser une seule clé pour signer le token
          const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'RANDOM_SECRET_KEY',
            { expiresIn: '24h' }
          );

          res.status(200).json({ userId: user._id, token });
        });
    })
    .catch(error => {
      console.error(' Erreur login:', error);
      res.status(500).json({ error });
    });
};
