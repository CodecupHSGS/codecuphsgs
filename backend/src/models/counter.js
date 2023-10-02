import { Schema, model } from "mongoose";

const STARTING_COUNT = 200; 

const counterSchema = new Schema({
    name: { type: String, required: true, unique: true},

    // there might be some initial documents (for example: admin user)
    // if there are more than STARTING_COUNT - 1, the database admin will have to set up the counter collection manually
    // when counting for the number of documents, use collection.count(), not this value
    count: { type: Number, required: true, default: STARTING_COUNT},   
})

const CounterModel = model('counter', counterSchema)

async function getCountAndAdd(name) { 
    if(typeof name != "string") { 
        throw new Error("type of key is not a string"); 
    }

    let counterDocument = await CounterModel.findOneAndUpdate({'name': name}, {$inc: {count: 1}}, {new: true}); 
    
    if(!counterDocument) { 
        counterDocument = await CounterModel.create({name})
    }
    
    return counterDocument.count; 
}

export default getCountAndAdd; 