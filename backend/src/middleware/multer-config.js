const multer = require('multer');
const sharp = require('sharp');
// const path = require('path'); // Non utilisé

// Définir les types de fichiers autorisés
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, `${name}${Date.now()}.${extension}`);
  },
});

const multerUpload = multer({ storage }).single('image');

const uploadAndOptimizeImage = (req, res, next) => {
  multerUpload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: 'Erreur lors du téléchargement de l\'image' });
    }
    if (!req.file) {
      return next();
    }
    const outputPath = `images/optimized_${req.file.filename}`;
    sharp(req.file.path)
      .resize(500)
      .toFile(outputPath, (error) => {
        if (error) {
          return res.status(500).json({ message: 'Erreur lors de l\'optimisation de l\'image' });
        }
        req.file.path = outputPath;
        req.file.filename = `optimized_${req.file.filename}`;
        return next();
      });
    return undefined; // Ajout pour s'assurer que la fonction retourne toujours une valeur
  });
};

module.exports = uploadAndOptimizeImage;
