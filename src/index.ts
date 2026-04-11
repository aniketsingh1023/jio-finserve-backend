import "dotenv/config"
import express from "express"
import cors from "cors"
import authRoutes from "./routes/auth.routes"

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())

// Health check route
app.get("/", (req, res) => {
  res.send("API running ")
})

// Auth routes
app.use("/api/auth", authRoutes)

// 404 handler 
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" })
})

//  Global error handler 
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: "Something went wrong" })
})

// Start server
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})