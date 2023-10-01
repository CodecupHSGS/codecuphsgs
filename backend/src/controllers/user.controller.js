import userService from "../services/user.service.js"
import { userInfoRestrictedView, userInfoUnrestrictedView } from "../views/user.js";
import BadRequestError from "./errors/BadRequestError.js";
import UnauthorisedError from "./errors/UnauthorisedError.js";

/**
 * This controller handle requests to register from new users
 */
async function createUser(req, res, next) { 
    const {username, email, password} = req.body;

    if(typeof username != "string" && typeof email != "string") { 
        throw new BadRequestError({err: "Missing or wrong type of username and email"}); 
    }

    if(typeof password != "string") { 
        throw new BadRequestError({err: "Missing or wrong type of password"}); 
    }

    const createdUser = await userService.createUser({username, email, password}); 

    const userClientView = req.session.isAdmin? userInfoUnrestrictedView(createdUser): userInfoRestrictedView(createdUser); 

    return res.status(200).send({msg: "User created", user: userClientView}); 
}

/**
 * This controller handle requests to get user data. The requested data can 
 * only be accessed by the same user or an admin. 
 */
async function getUser(req, res, next) { 
    const userIdString = req.params.userId; 

    if(isNaN(userIdString)) { 
        throw new BadRequestError("Missing or wrong type of userId"); 
    }

    const userId = parseInt(userIdString); 

    if(req.session.isAdmin !== true && req.session.userId !== userId) { 
        throw new UnauthorisedError(); 
    }

    const foundUser = await userService.getUser({id: parseInt(userIdString) }); 
    
    const userClientView = req.session.isAdmin? userInfoUnrestrictedView(foundUser): userInfoRestrictedView(foundUser); 

    return res.status(200).send({
        msg: "Retrieved successfully", 
        user: userClientView
    }); 
}

/**
 * Controllers to handle requests for the user in the session. 
 */
async function getCurrentUser(req, res, next) { 
    const userId = req.session.userId; 

    // return empty object if there is no current user. 
    if(userId == null) { 
        return res.status(403).send({msg: "No session created"}); 
    }

    const foundUser = await userService.getUser({id: userId}); 

    const userClientView = req.session.isAdmin? userInfoUnrestrictedView(foundUser): userInfoRestrictedView(foundUser); 

    return res.status(200).send({
        user: userClientView
    })
}
/**
 * CURRENTLY NOT SUPPORTED
 */

// async function getAllUsers(req, res, next) { 
//     let users = await UserModel.find()
//     console.log(users)

//     if(req.session.isAdmin) { 
//         return res.status(200).send({
//             msg: "retrieved successfully", 
//             users: users.map(userInfoUnrestrictedView)
//         })
//     }

//     return res.status(200).send({
//         msg: "retrieved successfully", 
//         users: users.map(userInfoRestrictedView)
//     })    
// }

const userController = { 
    createUser, 
    getUser, 
    getCurrentUser
    // getAllUsers, 
}

export default userController; 