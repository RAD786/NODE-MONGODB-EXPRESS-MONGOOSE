const express = require('express');
const authenticate = require('../authenticate');
const multer = require('multer'); //data processing from client side to server
const cors = require('./cors');


//stores files in a particular location and keeps the file name the same as when it's uploaded frm client side to server side
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

//filters incoming file upload to ensure they are an img file and the original name is the same. false rejects the upload. cb(null, true) accepts it.
const imageFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('You can upload only image files!'), false);
    }
    cb(null, true);
};

//enables image file uploads
const upload = multer({ storage: storage, fileFilter: imageFileFilter});

const uploadRouter = express.Router();

uploadRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200)) //handles a preflight request
.get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /imageUpload');
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(req.file);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /imageUpload');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /imageUpload');
});

module.exports = uploadRouter;