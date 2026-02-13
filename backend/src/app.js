/*
  Express Application Configuration
  Sets up the Express server with middleware, routes, and error handlers.
  This is the main application file that configures all HTTP endpoints.
 */

import express from "express"
import cors from "cors"

import incidentsRouter from "./routes/incidents.routes.js"
import { config } from "../config.js"

const app = express()

/*
  CORS Middleware
  Purpose: Enables Cross-Origin Resource Sharing to allow frontend to communicate with backend
  Usage: Applied to all routes automatically
  Configuration: Uses corsOrigin from config.js
 */
app.use(
  cors({
    origin: config.server.corsOrigin,
  }),
)

/*
  JSON Body Parser Middleware
  Purpose: Parses incoming JSON request bodies and makes data available in req.body
  Usage: Enables POST/PATCH requests with JSON payloads
 */
app.use(express.json())

/*
  Health Check Endpoint
  GET /health
  Purpose: Simple endpoint to verify server is running
  Returns: { status: "ok" }
  Usage: Used for monitoring and health checks
 */
app.get("/health", (req, res) => {
  res.json({ status: "ok" })
})

/*
  Incidents API Routes
  All routes starting with /api/incidents are handled by incidentsRouter
  See incidents.routes.js for specific endpoint definitions
 */
app.use("/api/incidents", incidentsRouter)

/*
  404 Not Found Handler
  Purpose: Handles requests to undefined routes
  Returns: 404 status with error message
 */
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" })
})

/*
  Global Error Handler
  Purpose: Catches and handles any errors thrown in route handlers
  Logs error to console and returns 500 status to client
 */
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err)
  res.status(500).json({ error: "Internal server error" })
})

export default app
