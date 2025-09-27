import { useEffect, useState } from "react";
import { MdMode, MdOutlineDone } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { MdModeEditOutline } from "react-icons/md";
import { FaTrash } from "react-icons/fa6";
import { IoClipboardOutline } from "react-icons/io5";
import axios from "axios";
import PomodoroWheel from "./PomodoroWheel";

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

  // <div>
  //     <PomodoroWheel minutes={25} />
  //     {/* rest of your app */}
  // </div

  <div
    style={{
      minHeight: "100vh",
      background: "#c0c0c0",
      fontFamily: "'Pixelated MS Sans Serif', MS Sans Serif, sans-serif",
      fontSize: "11px",
      padding: "20px",
      boxSizing: "border-box",

      // center the main window
      display: "flex",
      justifyContent: "center",
      alignItems: "center",

      // static background image
      backgroundImage: "url('/bg2.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      position: "relative",
    }}
  >
    {/* Windows 95 Desktop Pattern */}
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background:
          "linear-gradient(45deg, #008080 25%, transparent 25%), linear-gradient(-45deg, #008080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #008080 75%), linear-gradient(-45deg, transparent 75%, #008080 75%)",
        backgroundSize: "20px 20px",
        backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
        zIndex: -1,
        opacity: 0.1,
      }}
    />

    {/* Scrolling Marquee Bar
    <div
      style={{
        position: "fixed",
        bottom: 0, // swap to top: 0 for top bar
        left: 0,
        width: "100%",
        background: "black",
        color: "lime",
        fontFamily: "monospace",
        fontSize: "14px",
        overflow: "hidden",
        whiteSpace: "nowrap",
        borderTop: "2px solid #00ff00",
      }}
    >
      <div className="scrolling-text">
        <span>
          WELCOME TO YOUR PERSONAL PRODUCTIVITY APP! SIT DOWN, GRAB A DRINK, AND STUDY AWAY! WELCOME TO YOUR PERSONAL PRODUCTIVITY APP! SIT DOWN, GRAB A DRINK, AND STUDY AWAY! WELCOME TO YOUR PERSONAL PRODUCTIVITY APP! SIT DOWN, GRAB A DRINK, AND STUDY AWAY!
        </span>
        <span>
          WELCOME TO YOUR PERSONAL PRODUCTIVITY APP! SIT DOWN, GRAB A DRINK, AND STUDY AWAY! WELCOME TO YOUR PERSONAL PRODUCTIVITY APP! SIT DOWN, GRAB A DRINK, AND STUDY AWAY! WELCOME TO YOUR PERSONAL PRODUCTIVITY APP! SIT DOWN, GRAB A DRINK, AND STUDY AWAY!
        </span>
      </div>
    </div> */}

      {/* Main Window */}
    <div
      style={{
        background: "#c0c0c0",
        border: "2px outset #c0c0c0",
        maxWidth: "500px",
        width: "100%",
        boxShadow: "2px 2px 4px rgba(0,0,0,0.3)",
      }}
    >
        {/* Title Bar */}
        <div
          style={{
            background: "linear-gradient(90deg, #000080 0%, #0000ff 100%)",
            color: "white",
            padding: "2px",
            fontWeight: "bold",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "11px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              paddingLeft: "4px",
            }}
          >
            <div
              style={{
                width: "16px",
                height: "16px",
                background: "#ffff00",
                border: "1px solid #000",
              }}
            />
            Today's Tasks
          </div>
          <div style={{ display: "flex", gap: "2px" }}>
            <button style={winBtn}>_</button>
            <button style={winBtn}>□</button>
            <button style={winBtn}>×</button>
          </div>
        </div>

        {/* Menu Bar */}
        <div
          style={{
            background: "#c0c0c0",
            borderBottom: "1px solid #808080",
            padding: "4px",
            fontSize: "11px",
          }}
        >
          {["File", "Edit", "View", "Help"].map((item) => (
            <span
              key={item}
              style={{ padding: "4px 8px", cursor: "pointer" }}
              onMouseEnter={(e) => {
                e.target.style.background = "#0000ff";
                e.target.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.color = "black";
              }}
            >
              {item}
            </span>
          ))}
        </div>

        {/* Main Content */}
        <div
          style={{ padding: "10px", background: "#c0c0c0", minHeight: "400px" }}
        >
          {/* Add Task Form */}
          <form onSubmit={addTodo} style={{ marginBottom: "15px" }}>
            <div style={{ display: "flex", gap: "5px", marginBottom: "10px" }}>
              <input
                style={inputStyle}
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="What needs to be done?"
              />
              <button type="submit" style={btnStyle}>
                Add Task
              </button>
            </div>
          </form>

          {/* Todo List */}
          <div style={listBox}>
            {todos.length === 0 ? (
              <div style={{ padding: "20px", textAlign: "center", color: "#808080" }}>
                No tasks yet. Add one above!
              </div>
            ) : (
              todos.map((todo) => (
                <div key={todo._id}>
                  {editingTodo === todo._id ? (
                    <div style={{ display: "flex", gap: "8px", padding: "2px 4px" }}>
                      <input
                        style={inputStyle}
                        type="text"
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                      />
                      <div style={{ display: "flex", gap: "2px" }}>
                        <button onClick={() => saveEdit(todo._id)} style={smallBtn}>
                          <MdOutlineDone />
                        </button>
                        <button onClick={() => setEditingTodo(null)} style={smallBtn}>
                          <IoClose />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "2px 4px",
                        margin: "1px 0",
                        background: "white",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          onChange={() => toggleTodo(todo._id)}
                          style={{ width: "13px", height: "13px", cursor: "pointer" }}
                        />
                        <span
                          style={{
                            fontSize: "11px",
                            textDecoration: todo.completed ? "line-through" : "none",
                            color: todo.completed ? "#808080" : "inherit",
                          }}
                        >
                          {todo.text}
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: "2px" }}>
                        <button onClick={() => startEditing(todo)} style={smallBtn}>
                          <MdModeEditOutline />
                        </button>
                        <button onClick={() => deleteTodo(todo._id)} style={smallBtn}>
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Status Bar */}
        <div
          style={{
            background: "#c0c0c0",
            borderTop: "1px solid #808080",
            padding: "2px 8px",
            fontSize: "11px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div style={statusBox}>Ready</div>
          <div style={statusBox}>Tasks: {todos.length}</div>
        </div>
      </div>
    </div>
  );
}

const winBtn = {
  width: "16px",
  height: "14px",
  background: "#c0c0c0",
  border: "1px outset #c0c0c0",
  fontSize: "9px",
  cursor: "pointer",
  color: "#000",
};

const inputStyle = {
  flex: 1,
  padding: "2px 4px",
  border: "2px inset #c0c0c0",
  background: "white",
  fontFamily: "MS Sans Serif, sans-serif",
  fontSize: "11px",
};

const btnStyle = {
  padding: "2px 16px",
  border: "2px outset #c0c0c0",
  background: "#c0c0c0",
  fontFamily: "MS Sans Serif, sans-serif",
  fontSize: "11px",
  cursor: "pointer",
  minWidth: "75px",
};

const smallBtn = {
  padding: "1px 4px",
  border: "1px outset #c0c0c0",
  background: "#c0c0c0",
  fontSize: "9px",
  cursor: "pointer",
};

const listBox = {
  border: "2px inset #c0c0c0",
  background: "white",
  minHeight: "300px",
  padding: "4px",
};

const statusBox = {
  border: "1px inset #c0c0c0",
  padding: "1px 4px",
  background: "#c0c0c0",
};

// const scrollingText = {
//   display: "inline-block",
//   animation: "scroll-left 22s linear infinite",
// };


export default App;
