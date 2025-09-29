const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // "Bearer token"
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'RANDOM_SECRET_KEY');
    const userId = decodedToken.userId;
    req.auth = { userId: userId };
    next();
  } catch {
    res.status(401).json({ message: 'Requête non authentifiée !' });
  }
};
