import ServiceConflictError from "../services/errors/conflictError.js"

import ControllerConflictError from "../controllers/errors/ConflictError.js"
import ControllerError from "../controllers/errors/ControllerError.js";
import InternalError from "../controllers/errors/InternalError.js";

export default function serviceErrorHandler(err, res, req, next) { 
    // If thrown by controller: keep throwing it to the app's common error handler
    if(!err) { 
        return; 
    }

    if(err instanceof ControllerError) { 
        throw err; 
    }
    if(err instanceof ServiceConflictError) { 
        throw new ControllerConflictError(err.message); 
    }
    throw new InternalError(); 
}