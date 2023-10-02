import { Schema, model } from "mongoose";
import getCountAndAdd from "./counter.js";

const userSchema = new Schema({
    id: {type: Number, required: true, unique: true}, 
    isAdmin: {type: Boolean, required: true, default: false}, 
    password: {type: String, required: true}, 

    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true}, 

    registerDate: {type: Date, required: true, default: () => new Date()}, 

    name: {type: String}, 
})

const UserModel = model('User', userSchema)

export default UserModel; 

export async function getNextUserId() { 
	return await getCountAndAdd('user'); 
}