
import ValidationError from "@/backend_api/errors/validationError";
import UserError from "@/backend_api/errors/userError";
import InternalError from "@/backend_api/errors/internalError";
import ServerError from "@/backend_api/errors/serverError";
import APIError from "@/backend_api/errors/apiError";

export default function alertBackendAPIError(error: any, location: string) { 
    if(error instanceof APIError) { 
        // API errors can be either UserError, InternalError or ValidationError. 
        if(error instanceof UserError) { 
            alert("Error: " + error.message); 
        }
        else if(error instanceof InternalError) {
            if(error instanceof ServerError) { 
                alert("Server error. Please try again later. "); 
            }
            else { 
                alert("Internal error"); 
            }
        }
        else if(error instanceof ValidationError) { 
            console.error(`Validation error at : ${location}` + error); 
            alert("Internal error"); 
        }
        else { 
            // wth
            console.error(`Unknown API error at : ${location}` + error); 
            alert("Intenal error"); 
        }
    }
    else { 
        console.error("Unknown error encountered when handling login submit: " + error);
        alert("Internal error"); 
    }
}