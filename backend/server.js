import express from 'express'; 
import dotenv from 'dotenv'; 
import todoRoutes from "./routes/todo.routes.js"; 
import path from "path";
import { connectDB } from './config/db.js';

dotenv.config(); 

const app = express(); 

// app.get("/", (req, res) => {
//     res.send("Server is ready");
// });

// be able to parse request bodies that has json data
app.use(express.json());

app.use("/api/todos", todoRoutes)

const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(8000, () => {
    connectDB(); 
    console.log("Server started at http://localhost:8000");
});

