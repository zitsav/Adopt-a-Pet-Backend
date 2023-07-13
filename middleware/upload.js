const uploadConfig = require('../multerConfig');
const fs = require('fs');

const uploadImages = (req, res, next) => {
    uploadConfig.array('images')(req, res, async (error) => {
        if (error) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: 'Failed to upload images' });
        }
        try {
            const images = req.files.map((file) => file.path);
            req.uploadedImages = images;
            req.files.forEach((file) => {
                fs.unlinkSync(file.path);
            });
            next();
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to process images' });
        }
    });
};

module.exports = uploadImages;