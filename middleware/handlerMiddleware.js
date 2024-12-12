const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'C:/Users/yagom/Documents/estudos/vscode/node/blablacar2/uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

// Configuração do middleware
const uploadMiddleware = multer({ storage });

module.exports = {
    uploadMiddleware,
};