
import multer from "multer";
import storageEngine from "./multerStorage.js";
  
const multerSingleFileUpload = multer({ storage: storageEngine }).single('sourceCode'); 

export default function fileUpload(req, res, next) { 
    multerSingleFileUpload(req, res, function (error) { 
        if(error) { 
            console.error("Error at uploading file: " + error); 
            res.status(500).send({msg: "Uploading file failed"});
        }
        else { 
            if(!req.file) { 
                console.error("Upload did not encouter error but no file found"); 
                res.status(500).send({msg: "Internal server error"}); 
            }
            console.log("Saving file successful. ")
            console.log("File info: "); 
            console.log(req.file); 
            next(); 
        }
    }); 
}