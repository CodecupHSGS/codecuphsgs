import multer from "multer"; 
import storageEngine from "./multerStorage.js";

//  multer({ storageEngine }) -> BUGG
const multerMultifile = multer({ storage: storageEngine }).fields([
    { name: 'judgeFile', maxCount: 1}, 
    { name: 'sourceFile1', maxCount: 1}, 
    { name: 'sourceFile2', maxCount: 1}
])

export default function customRunFilesUpload(req, res, next) { 
    multerMultifile(req, res, function (error) { 
        if(error) { 
            console.error("Error at uploading file: " + error); 
            res.status(500).send({msg: "Uploading file failed"});
        }
        else { 
            console.log("Saving file successful. ")
            console.log("File info: "); 
            console.log(req.files); 
            next(); 
        }
    }); 
}