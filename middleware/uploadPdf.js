const multer = require('multer')
const path = require('path')

var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public/pdf/')     // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        const match = ["application/pdf"];
        
        if (match.indexOf(file.mimetype) === -1) {
            var message = `${file.originalname} is invalid. Only accept pdf.`;
            return callBack(message, null);
        }

        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

var uploadPdf = multer({
    storage: storage
});
module.exports = uploadPdf;