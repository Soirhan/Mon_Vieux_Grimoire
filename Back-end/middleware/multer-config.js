const multer = require('multer');
const path = require('path');

// Dossier de stockage
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const ext = path.extname(file.originalname);
    callback(null, name + Date.now() + ext);
  }
});

// Filtrage fichiers (images uniquement)
const fileFilter = (req, file, callback) => {
  const allowed = /jpg|jpeg|png/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.test(ext)) {
    callback(null, true);
  } else {
    callback(new Error('Format d\'image non supporté'));
  }
};

module.exports = multer({ storage: storage, fileFilter: fileFilter }).single('image');
