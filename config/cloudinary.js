
const cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'norsa',
    api_key: process.env.CLOUDINARY_API_KEY || '666263827466723',
    api_secret: process.env.CLOUDINARY_API_SECRET || '9PoAtT_Dy-GDp_2N_cmrrLfPLRc',
});
module.exports = cloudinary;