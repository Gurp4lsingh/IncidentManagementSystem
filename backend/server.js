/*
  Server Entry Point
  Starts the Express server and initializes the data store.
  This is the main entry point for the backend application.
 */

import app from "./src/app.js"
import { initializeStore } from "./src/store/incidents.store.js"
import { config } from "./config.js"

/*
  Start Server Function
  Purpose: Initializes the data store and starts the HTTP server
  
  Workflow:
  1. Initialize the incidents store (loads data from JSON file)
  2. Start the Express server on configured port
  3. Log server status to console
  
  The server must initialize the store before accepting requests
  to ensure data is loaded into memory from the JSON file.
 */
async function startServer() {
  try {
    // Initialize store - loads incidents from JSON file
    console.log("Initializing incidents store...")
    await initializeStore()
    console.log("Store initialized successfully")

    // Start HTTP server
    const PORT = process.env.PORT || config.server.port
    app.listen(PORT, () => {
      console.log(
        `IncidentTracker API running on http://${config.server.host}:${PORT}`,
      )
      console.log(`Data file: ${config.storage.incidentsFilePath}`)
    })
  } catch (error) {
    console.error("Failed to start server:", error)
    process.exit(1)
  }
}

// Start the server
startServer()
