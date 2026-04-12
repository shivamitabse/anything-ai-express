import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import createOrder from "./createOrder.js";
import { getProducts } from "./getProducts.js";
import { getProductDetails } from "./getProductDetails.js";
import { protect } from "./middleware/authMiddleware.js";
import paymentVerification from "./paymentVerification.js";
import webhookVerification from "./webhookVerification.js";
import addProduct from "./addProduct.js";
import errorHandler from "./errorHandler.js";

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

app.post(
  "/api/v1/verify-webhook",
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  }),
  webhookVerification,
);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/products");
  },

  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // ✅ 2MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true); // ✅ accept
    } else {
      cb(new Error("Only image files are allowed"), false); // ❌ reject
    }
  },
});

app.post("/api/v1/add-product", upload.array("images", 5), addProduct);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server running on port ${PORT}`));
