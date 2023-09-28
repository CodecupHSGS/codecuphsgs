import ControllerError from "./ControllerError.js";

export default class UnauthorisedError extends ControllerError { 
    constructor(message = "Unauthorised access") { 
        super(message)
    }
}