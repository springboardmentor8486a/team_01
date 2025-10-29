const multer = require('multer');

const multerErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        switch (err.code) {
            case 'LIMIT_FILE_SIZE':
                return res.status(400).json({
                    success: false,
                    message: 'File size too large. Maximum allowed size is 10MB.',
                    error: 'FILE_TOO_LARGE'
                });
            case 'LIMIT_FILE_COUNT':
                return res.status(400).json({
                    success: false,
                    message: 'Too many files uploaded.',
                    error: 'TOO_MANY_FILES'
                });
            case 'LIMIT_UNEXPECTED_FILE':
                return res.status(400).json({
                    success: false,
                    message: 'Unexpected file field.',
                    error: 'UNEXPECTED_FILE'
                });
            default:
                return res.status(400).json({
                    success: false,
                    message: 'File upload error.',
                    error: err.code
                });
        }
    }
    
    // If it's not a multer error, pass it to the next error handler
    next(err);
};

module.exports = multerErrorHandler;
