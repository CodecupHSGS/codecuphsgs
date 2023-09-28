import assert from "assert";

function isStringBoolean(s) { 
    if(s == null) { 
        return false; 
    }
    
    assert(typeof s === "string"); 
    return s === "true" || s === "false"; 
}

function stringToBoolean(s) { 
    assert(typeof s === "string"); 
    return s === "true"; 
}

export { 
    isStringBoolean, 
    stringToBoolean
}