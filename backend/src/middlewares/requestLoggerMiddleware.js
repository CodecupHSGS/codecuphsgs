export default function requestLoggerMiddleware(req, res, next) { 
    console.log("Server received request at " + req.url); 
    next(); 
}