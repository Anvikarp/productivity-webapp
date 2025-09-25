import express from 'express';
import Todo from '../models/todo.model.js';

//operations for CRUD: adding, updateding, etc tasks
const router = express.Router(); 

// get all tasks
router.get("/", async (req, res) => {
    try {
        // get all the todos/tasks
        const todos = await Todo.find(); 
        // send a json response back to the client, so frontend has access
        res.json(todos); 
        
    } catch (error) {
        // internal error 500
        res.status(500).json({message: error.message})
    }
})

// add a new task
router.post("/", async (req, res) => {
    const todo = new Todo({
        // request will come from client and put into text
        text: req.body.text
    })
    try {
        // save task in mongoDB collection
        const newTodo = await todo.save();
        res.status(201).json(newTodo); 
    } catch (error) {
        // 400 bad request
        res.status(400).json({message: error.message})
    }
})

// update a todo (text and or/ completed)
router.patch("/:id", async (req, res) => {
    try {
        // try to find the specific task by id
        const todo = await Todo.findById(req.params.id); 
        if (!todo) 
            // 404 not found
            return res.status(404).json({message: "Todo not found"}); 
         
        // update the undefined body  
        if (req.body.text !== undefined){
            todo.text = req.body.text; 
        }

        // update completed status of task
        if (req.body.completed !== undefined){
            todo.completed = req.body.completed; 
        }

        // save the update and show
        const updatedTodo = await todo.save(); 
        res.json(updatedTodo); 

    } catch (error) {
        res.status(400).json({message: error.message});  
    }
}); 

// delete a task
router.delete("/:id", async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);
        res.json({message: "Todo deleted"});
        
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

export default router; 