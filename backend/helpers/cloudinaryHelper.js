const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = (fileBuffer, folder = 'profile_images') => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: 'image',
                transformation: [
                    { width: 300, height: 300, crop: 'fill' } // Resize to 300x300
                ]
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );
        stream.end(fileBuffer);
    });
};

module.exports = {
    uploadToCloudinary
};
