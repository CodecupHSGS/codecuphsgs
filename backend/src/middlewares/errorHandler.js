import BadRequestError from "../controllers/errors/BadRequestError.js";
import ConflictError from "../controllers/errors/ConflictError.js";
import UnauthorisedError from "../controllers/errors/UnauthorisedError.js";

/**
 * Final error handler, receiving errors from controllers and send back to client
 */
export default function errorHandler(err, req, res, next) { 
    if(!err) { 
        return; 
    }
    if(err instanceof BadRequestError) { 
        return res.status(400).send({msg: err.message}); 
    }
    if(err instanceof UnauthorisedError) {
        return res.status(403).send({msg: err.message}); 
    }
    if(err instanceof ConflictError) { 
        return res.status(409).send({msg: err.message}); 
    }
    
    return res.status(500).send({msg: "Internal Server Error"}); 
}