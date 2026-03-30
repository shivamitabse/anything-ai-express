import pool from "../models/db.js";

// CREATE
export const createTask = async (req, res) => {
  const { title, description } = req.body;

  await pool.execute(
    "INSERT INTO tasks (title, description, user_id) VALUES (?, ?, ?)",
    [title, description, req.user.id],
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
