
import multer from "multer";

const storageEngine = multer.diskStorage({
    destination: function (req, file, cb) {
      console.log(file); 
      cb(null, '/Users/hoanggiapvu/Documents/codecuphsgs/backend/uploads'); 
    },
    filename: function (req, file, cb) { 
      cb(null, 'userId-' + req.session.userId + '_time-' + Date.now() + '_' + file.originalname); 
    }
  }); 

  export default storageEngine; 