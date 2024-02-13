const multer = require('multer');

//хранение файлов на диск с помощью модуля multer.diskStorage()
const storage = multer.diskStorage({
  // функция для хранения файлов
  destination(req, file, cb) {
    cb(null, 'images'); // директория для хранения файлов и именование файлов
  },
  // функция для именования файлов
  filename(req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname); // именование файлов
  },
});

// допустимые типы файлов для загрузки фотографий
const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];

// валидатор файла для загрузки фотографий
const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
    cb(new Error('Only images are allowed!')); // ошибка если файл не является изображением и его размер больше допустимого размера файла в конфигурации хранилища multer.diskStorage()
  }
};

module.exports = multer({
  storage: storage,
  fileFilter,
});
