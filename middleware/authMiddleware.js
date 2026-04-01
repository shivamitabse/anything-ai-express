import jwt from "jsonwebtoken";

const JWT_SECRET = "secretkey";

export const protect = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

// ADMIN CHECK (your logic)
export const isAdmin = (req, res, next) => {
  if (req.user.id === 1) {
    next();
  } else {
    res.status(403).json({ message: "Admin only" });
  }
};
