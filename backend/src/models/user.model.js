import { Schema, model } from "mongoose";

const userSchema = new Schema({
    id: {type: Number, required: true, unique: true}, 
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true}, 
    email: {type: String, required: true, unique: true}, 

    name: {type: String, required: true}, 
    isAdmin: {type: Boolean, default: false}, 
    contests: {type: [Number], default: []}
})

const UserModel = model('User', userSchema)

export default UserModel; 

