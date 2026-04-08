import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import createOrder from "./createOrder.js";
import { getProducts } from "./getProducts.js";
import { getProductDetails } from "./getProductDetails.js";
import { protect } from "./middleware/authMiddleware.js";
import paymentVerification from "./paymentVerification.js";

dotenv.config();

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

const allowedOrigins = ["http://localhost:5173", "https://testmysite.in"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", taskRoutes);

app.get("/api/v1/", (req, res) => {
  res.send("API Running...");
});

app.get("/api/v1/get-products", getProducts);

app.get("/api/v1/get-products/:id", getProductDetails);

app.post("/api/v1/create-order", protect, createOrder);

app.post("/api/v1/verify-payment", paymentVerification);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server running on port ${PORT}`));
