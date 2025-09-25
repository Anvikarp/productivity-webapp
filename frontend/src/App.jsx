import { useEffect, useState } from "react";
import { MdMode, MdOutlineDone } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { MdModeEditOutline } from "react-icons/md";
import { FaTrash } from "react-icons/fa6";
import { IoClipboardOutline } from "react-icons/io5";
import axios from "axios";

function App() {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);
  // by default the tasks are not being edited
  const [editingTodo, setEditingTodo] = useState(null);
  const [editedText, setEditedText] = useState("");

  // function to add the task
  const addTodo = async (e) => {
    e.preventDefault();
    // don't allow empty tasks
    if (!newTodo.trim()) return;
    try {
      // local host is written in vite/config.js
      const response = await axios.post("/api/todos", { text: newTodo });
      setTodos([...todos, response.data]);
      setNewTodo("");
    } catch (error) {
      console.log("Error adding todo", error);
    }
  };

  // keeps todos in the list even after refreshing the page
  const fetchTodos = async () => {
    try {
      const response = await axios.get("/api/todos");
      console.log(response.data);
      setTodos(response.data);
    } catch (error) {
      console.log("Error fetching todos: ", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const startEditing = (todo) => {
    setEditingTodo(todo._id);
    setEditedText(todo.text);
  };

  const saveEdit = async (id) => {
    try {
      const response = await axios.patch(`/api/todos/${id}`, {
        text: editedText
      });
      // if the todo matches the id, update it with the dit
      setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
      // remove the icons after edited
      setEditingTodo(null);
    } catch (error) {
      console.log("Error updating todo: ", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.log("Error deleting todo: ", error);
    }
  };

  const toggleTodo = async (id) => {
    try {
      // compare each todo's id to the incoming id
      const todo = todos.find((todo) => todo._id === id);
      const response = await axios.patch(`/api/todos/${id}`, {
        completed: !todo.completed
      });
      setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
    } catch (error) {
      console.log("Error toggling todo: ", error);
    }
  };

  return (
    // 1st div gives a sunset gradient background
    // 2nd div gives a white box around the Task Manager
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-amber-100 flex items-center justify-center p-4">
      <div className="bg-white/75 backdrop-blur-md border border-white/30 rounded-2xl shadow-xl shadow-rose-200/50 w-full max-w-lg p-8">
        <h1 className="text-4xl font-bold text-amber-900 mb-8 text-center">
          Today's Tasks
        </h1>
        <form
          onSubmit={addTodo}
          className="flex items-center gap-2 shadow-sm border border-rose-200 p-2 rounded-lg bg-rose-50"
        >
          <input
            className="flex-1 outline-none px-3 py-2 text-amber-900 placeholder-rose-300 bg-transparent"
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="What needs to be done?"
            required
          />
          <button
            type="submit"
            className="hover:shadow-lg hover:shadow-rose-400/40 transition duration-200 bg-rose-400 hover:bg-rose-500 text-white px-4 py-2 rounded-md font-medium cursor-pointer"
          >
            Add Task
          </button>
        </form>
        <div className="mt-4">
          {todos.length === 0 ? (
            <div></div>
          ) : (
            <div className="flex flex-col gap-4">
              {todos.map((todo) => (
                <div key={todo._id}>
                  {editingTodo === todo._id ? (
                    <div className="flex items-center gap-x-3">
                      <input
                        className="hover:shadow-lg hover:shadow-rose-400/40 transition duration-200 flex-1 p-3 border rounded-lg border-rose-200 outline-none focus:ring-2 focus:ring-rose-300 text-amber-900 shadow-inner bg-rose-50"
                        type="text"
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                      />
                      <div className="flex gap-x-2">
                        <button
                          onClick={() => saveEdit(todo._id)}
                          className="hover:shadow-lg hover:shadow-rose-400/40 transition duration-200 px-4 py-2 bg-rose-400 text-white rounded-lg hover:bg-rose-600 cursor-pointer"
                        >
                          <MdOutlineDone />
                        </button>
                        <button
                          className="px-4 py-2 bg-rose-200 text-amber-900 rounded-lg hover:bg-rose-300 cursor-pointer"
                          onClick={() => setEditingTodo(null)}
                        >
                          <IoClose />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-x-4 overflow-hidden">
                        <button
                          onClick={() => toggleTodo(todo._id)}
                          className={`flex-shrink-0 h-6 w-6 border rounded-full flex items-center justify-center ${
                            todo.completed
                              ? "bg-rose-400 border-rose-400"
                              : "border-rose-300 hover:border-rose-500"
                          }`}
                        >
                          {!todo.completed && <MdOutlineDone />}
                        </button>
                        <span
                          className={`text-amber-900 font-medium truncate transition ${
                            todo.completed ? "line-through text-rose-400" : ""
                          }`}>
                          {todo.text}
                        </span>
                      </div>
                      <div className="flex gap-x-2">
                        <button
                          className="p-2 text-amber-600 hover:text-amber-800 rounded-lg hover:bg-amber-100 duration-200 hover:shadow-lg hover:shadow-rose-400/40 transition duration-200"
                          onClick={() => startEditing(todo)}
                        >
                          <MdModeEditOutline />
                        </button>
                        <button
                          onClick={() => deleteTodo(todo._id)}
                          className="p-2 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-100 duration-200 hover:shadow-lg hover:shadow-rose-400/40 transition duration-200"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;