import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../models/db.js";

const JWT_SECRET = process.env.JWT_SECRET;

// GET ME

export const getMe = (req, res) => {
  res.json({ user: req.user });
};

// REGISTER
export const register = async (req, res) => {
  const { email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  await pool.execute("INSERT INTO users (email, password) VALUES (?, ?)", [
    email,
    hashed,
  ]);

  res.json({ message: "User registered" });
};

// LOGOUT

export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};

// LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;

  const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [
    email,
  ]);

  const user = rows[0];

  if (!user) return res.status(401).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) return res.status(401).json({ message: "Invalid password" });

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    },
  );

  res.cookie("token", token, {
    httpOnly: true, // JS on frontend can't access it
    secure: true, // only send over HTTPS
    sameSite: "lax", // or "strict" depending on your needs
    maxAge: 24 * 60 * 60 * 1000, // optional: 1 day in ms
  });

  res.json({ message: "Login successful" });
};
