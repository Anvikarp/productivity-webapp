import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
    // the task itself
    text:{
        type: String,
        required: true
    },
    // is taks completed
    completed:{
        type: Boolean,
        default: false
    }
    //what time the task was created
}, {timestamps: true})

// be able to use the todoSchema
const Todo = mongoose.model("Todo", todoSchema);
export default Todo; 


