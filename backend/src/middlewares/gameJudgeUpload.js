
import multer from "multer";
import storageEngine from "./multerStorage.js";


//  multer({ storageEngine }) -> BUGG
const multerMultifile = multer({ storage: storageEngine }).fields([
    { name: 'judgeFile', maxCount: 1}, 
    { name: 'renderFile', maxCount: 1}, 
    { name: 'statementFile', maxCount: 1}
])

export default function gameFilesUpload(req, res, next) { 
    multerMultifile(req, res, function (error) { 
        if(error) { 
            console.error("Error at uploading file: " + error); 
            res.status(500).send({msg: "Uploading file failed"});
        }
        else { 
            if(!req.files) { 
                console.error("Upload did not encouter error but no file found"); 
                res.status(500).send({msg: "Internal server error"}); 
            }
            console.log("Saving file successful. ")
            console.log("File info: "); 
            console.log(req.files); 
            next(); 
        }
    }); 
}