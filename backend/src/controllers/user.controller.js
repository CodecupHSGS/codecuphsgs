import UserModel from "../models/user.model.js"
import ValidationError from "../services/errors/validationError.js";
import userService from "../services/user.service.js"
import { userInfoRestrictedView, userInfoUnrestrictedView } from "../utils/user.js";

async function createUser(req, res, next) { 
    const {username, email, password} = req.body;

    // validation
    if(!username && !email) { 
        return res.status(403).send({err: "Missing username and email"}); 
    }

    if(!password) { 
        return res.status(403).send({err: "Missing password"}); 
    }

    try { 
        const createdUser = userService.createUser({
            username, 
            email, 
            password
        }); 

        const userClientView = req.session.isAdmin? userInfoUnrestrictedView(createdUser): userInfoRestrictedView(createdUser); 

        return res.status(200).send({msg: "User created", user: userClientView}); 
    }
    catch(err) {
        if(err instanceof ValidationError) { 
            return res.status(403).send({err: err.message}); 
        }
        // abstract away internal service errors. 
        else {
            console.error("Error at createUser controller: " + err); 
            return res.status(500).send({err: "Internal Server Error"}); 
        }
    }
}

async function getUser(req, res, next) { 
    const {userId} = req.params; 

    if(!userId) { 
        return res.status(403).send({err: "Missing userId"}); 
    }

    if(!req.session.isAdmin && req.session.userId !== userId) { 
        return res.status(403).send({err: "Unauthorised access"}); 
    }

    try {
        const foundUser = userService.getUser({id: userId}); 
        const userClientView = req.session.isAdmin? userInfoUnrestrictedView(foundUser): userInfoRestrictedView(foundUser); 
        return res.status(200).send({
            msg: "Retrieved successfully", 
            user: userClientView
        }); 
    }
    catch(err) { 
        if(err instanceof ValidationError) { 
            return res.status(409).send({err: err.message}); 
        }
        else { 
            console.error("Error at getUser controller: " + err); 
            return res.status(500).send({err: "Internal Server Error"}); 
        }
    }
}

// received "cannot GET /users". thought it was because of mispelling some words, 
// but it is in fact because of the function getAllUser.

async function getAllUsers(req, res, next) { 
    let users = await UserModel.find()
    console.log(users)

    if(req.session.isAdmin) { 
        return res.status(200).send({
            msg: "retrieved successfully", 
            users: users.map(userInfoUnrestrictedView)
        })
    }

    return res.status(200).send({
        msg: "retrieved successfully", 
        users: users.map(userInfoRestrictedView)
    })    
}

export { 
    createUser, 
    getUser, 
    getAllUsers, 
}