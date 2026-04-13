import "dotenv/config"
import express from "express"
import cors from "cors"
import authRoutes from "./routes/auth.routes"
import userRoutes from "./routes/user.routes"
import contactRoutes from "./routes/contact.routes";
import loanApplicationRoutes from "./routes/loan-application.routes"

const app = express()

// Middlewares
// Configure CORS to accept requests from frontend
const corsOptions = {
  origin: (origin: any, callback: any) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:8081",
      "http://localhost:19006",
      "http://localhost:19007",
      "http://127.0.0.1:8081",
      "http://127.0.0.1:19006",
      "http://127.0.0.1:19007",
      "http://192.168.1.100:8081",
    ];
    
    // Check if origin is in allowed list or starts with 192.168 (local network)
    if (allowedOrigins.includes(origin) || origin.startsWith("http://192.168")) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error("CORS not allowed"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  next();
})

// Health check route
app.get("/", (req, res) => {
  res.json({ status: "API running", time: new Date().toISOString() })
})

app.get("/health", (req, res) => {
  res.json({ status: "OK" })
})

// Auth routes
app.use("/api/auth", authRoutes)

// User routes
app.use("/api/users", userRoutes)

// Loan application routes
app.use("/api/loan-applications", loanApplicationRoutes)

//contact us page routes
app.use("/api/contact", contactRoutes);

// 404 handler 
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" })
})

//  Global error handler 
app.use((err: any, req: any, res: any, next: any) => {
  console.error("Global error handler:", err)
  res.status(500).json({ error: "Something went wrong" })
})

// Start server
const PORT = process.env.PORT || 5050

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`)
  console.log(` CORS enabled for:`, corsOptions.origin)
})