
import multer from "multer";
import fs from "fs"
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), process.env.UPLOAD_DIR); 
if(!fs.existsSync(UPLOAD_DIR)) { 
  fs.mkdirSync(UPLOAD_DIR); 
}

const storageEngine = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, UPLOAD_DIR); 
    },
    filename: function (req, file, cb) { 
      cb(null, 'userId-' + req.session.userId + '_time-' + Date.now() + '_' + file.originalname); 
    }
  }); 

  export default storageEngine; 