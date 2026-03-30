import pool from "../models/db.js";
import { v4 as uuidv4 } from "uuid";

// CREATE
export const createTask = async (req, res) => {
  const { title, description, userId } = req.body;

  console.log(uuidv4(), title, description, userId);

  await pool.execute(
    "INSERT INTO tasks (id, title, description, user_id) VALUES (?, ?, ?, ?)",
    [uuidv4(), title, description, userId],
  );

  res.json({ message: "Task created" });
};

// GET ALL
export const getTasks = async (req, res) => {
  let query;
  let params = [];

  if (req.user.id === 1) {
    query = "SELECT * FROM tasks"; // admin
  } else {
    query = "SELECT * FROM tasks WHERE user_id = ?";
    params = [req.user.id];
  }

  const [rows] = await pool.execute(query, params);

  res.json(rows);
};
