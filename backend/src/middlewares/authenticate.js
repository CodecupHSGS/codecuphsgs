import UserModel from "../models/user.model.js";
import { userInfoRestrictedView, userInfoUnrestrictedView } from "../utils/user.js";
import bcrypt from "bcrypt"; 

async function createSession(req, res, next) {    
    let username = req.body.username; 
    let password = req.body.password; 
    let email = req.body.email; 


    if((!username && !email) || !password) { 
        return res.status(400).send({msg: "Missing information"}); 
    }

    const user = username? await UserModel.findOne({username}): await UserModel.findOne({email})
    if(!user) {
        return res.status(409).send({msg: "User not found"}); 
    }

    if((await bcrypt.compare(password, user.password)) == false) { 
        return res.status(409).send({
            msg: "Wrong password", 
        }); 
    }

    req.session.userId = user.id; 
    req.session.isAdmin = user.isAdmin
    return res.status(200).send({
        msg: "logged in", 
        user: userInfoRestrictedView(user)
    }); 
}

async function endSession(req, res, next) { 
    console.log("Received log out request"); 
    
    if(!req.session.id) { 
        return res.status(403).send({msg:"not logged in"})
    }

    req.session.destroy(); 
    return res.status(200).send({msg: "logged out"}); //
}

export { 
    createSession, 
    endSession, 
}