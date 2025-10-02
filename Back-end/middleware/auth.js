const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: 'Requête non authentifiée !' });
    }
    const token = req.headers.authorization.split(' ')[1]; // "Bearer token"
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'RANDOM_SECRET_KEY');
    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Requête non authentifiée !' });
  }
};
