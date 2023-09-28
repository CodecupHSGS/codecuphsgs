import bcrypt from "bcrypt"

import UserModel from "../models/user.model.js"

import ValidationError from "./errors/validationError.js";
import ConflictError from "./errors/conflictError.js";

// throws serviceError.
async function createUser({ 
    username, 
    email, 
    password
}) {      

    if((typeof username !== "string" && typeof email !== "string") || typeof password !== "string") { 
        throw new ValidationError("Missing or wrong parameter types"); 
    }

    // findOne return null if not found, so no catching needed. 
    if(await UserModel.findOne({username})) { 
        throw new ConflictError("Username already exists"); 
    }

    if(await UserModel.findOne({email})) { 
        throw new ConflictError("Email aready exists"); 
    }


    const userDocument = await UserModel.create({ 
        id: await UserModel.count() + 1, 
        username: username, 
        password: await bcrypt.hash(password, 10), 
        email: email
    })
    
    return userDocument.toObject(); 
}

async function getUser({
    id
}) { 
    if(typeof id !== "number") { 
        throw new ValidationError("Parameter missing ID"); 
    }

    const userDocument = await UserModel.findOne({id}); 

    if(!userDocument) { 
        throw new ConflictError("No user with such id"); 
    }
    
    return userDocument.toObject(); 
}

const userService = { 
    createUser,
    getUser
}

export default userService; 