/*
  Incidents Routes Module
  Defines all HTTP endpoints for incident management operations.
  Handles routing, request validation, and response formatting.
 */

import express from "express"
import multer from "multer"

import {
  listAll,
  findById,
  createIncident,
  updateStatus,
  archiveIncident,
  resetArchivedIncident,
} from "../store/incidents.store.js"
import { parseCsvBuffer } from "../utils/csv.js"
import {
  validateCreateIncident,
  validateStatusChange,
  validateArchive,
  validateReset,
} from "../utils/validate.js"

const router = express.Router()

// Configure multer for file uploads (stores in memory)
const upload = multer({ storage: multer.memoryStorage() })

/*
  GET /api/incidents
  Lists all incidents
  Query params:
    - includeArchived: boolean (default: false) - whether to include archived incidents
 
  Purpose: Retrieves all incidents for display on dashboard and incident list
  Returns: Array of incident objects
 */
router.get("/", (req, res) => {
  const includeArchived = req.query.includeArchived === "true"
  res.json(listAll(includeArchived))
})

/*
  GET /api/incidents/:id
  Gets a specific incident by ID
  Purpose: Retrieves detailed information about a single incident
  Returns: Incident object or 404 error if not found
 */
router.get("/:id", (req, res) => {
  const incident = findById(req.params.id)
  if (!incident) return res.status(404).json({ error: "Incident not found" })
  res.json(incident)
})

/*
 POST /api/incidents
  Creates a new incident
  Body: { title, description, category, severity }
 
  Purpose: Creates a new incident record in the system
  Workflow:
  1. Validates the request body using validateCreateIncident
  2. If validation fails, returns 400 error with validation errors
  3. Creates the incident with generated ID, OPEN status, and timestamp
  4. Saves to file
  5. Returns the created incident with 201 status
 */
router.post("/", async (req, res) => {
  try {
    const result = validateCreateIncident(req.body)
    if (!result.ok) {
      return res.status(400).json({ error: result.errors })
    }

    const incident = await createIncident(result.value)
    res.status(201).json(incident)
  } catch (error) {
    console.error("Error creating incident:", error)
    res.status(500).json({ error: "Failed to create incident" })
  }
})

/*
  PATCH /api/incidents/:id/status
  Updates the status of an incident
  Body: { status }
 
  Purpose: Changes an incident's status following allowed workflow transitions
  Workflow:
  1. Finds the incident by ID
  2. Validates the status transition using validateStatusChange
  3. If validation fails, returns 400 error
  4. Updates the status
  5. Saves to file
  6. Returns the updated incident
 */
router.patch("/:id/status", async (req, res) => {
  try {
    const incident = findById(req.params.id)
    if (!incident) return res.status(404).json({ error: "Incident not found" })

    const check = validateStatusChange(incident.status, req.body.status)
    if (!check.ok) return res.status(400).json({ error: check.error })

    const updated = await updateStatus(incident.id, check.next)
    res.json(updated)
  } catch (error) {
    console.error("Error updating incident status:", error)
    res.status(500).json({ error: "Failed to update incident status" })
  }
})

/*
  POST /api/incidents/:id/archive
  Archives an incident (changes status to ARCHIVED)
 
  Purpose: Moves an incident to archived status for long-term storage
  Workflow:
  1. Finds the incident by ID
  2. Validates that incident can be archived (must be OPEN or RESOLVED)
  3. If validation fails, returns 400 error
  4. Changes status to ARCHIVED
  5. Saves to file
  6. Returns the archived incident
 */
router.post("/:id/archive", async (req, res) => {
  try {
    const incident = findById(req.params.id)
    if (!incident) return res.status(404).json({ error: "Incident not found" })

    const check = validateArchive(incident.status)
    if (!check.ok) return res.status(400).json({ error: check.error })

    const archived = await archiveIncident(incident.id)
    if (!archived) {
      return res.status(400).json({ error: "Failed to archive incident" })
    }

    res.json(archived)
  } catch (error) {
    console.error("Error archiving incident:", error)
    res.status(500).json({ error: "Failed to archive incident" })
  }
})

/*
  POST /api/incidents/:id/reset
  Resets an archived incident back to OPEN status
 
  Purpose: Restores an archived incident back to active workflow
  Workflow:
  1. Finds the incident by ID
  2. Validates that incident can be reset (must be ARCHIVED)
  3. If validation fails, returns 400 error
  4. Changes status back to OPEN
  5. Saves to file
  6. Returns the reset incident
 */
router.post("/:id/reset", async (req, res) => {
  try {
    const incident = findById(req.params.id)
    if (!incident) return res.status(404).json({ error: "Incident not found" })

    const check = validateReset(incident.status)
    if (!check.ok) return res.status(400).json({ error: check.error })

    const reset = await resetArchivedIncident(incident.id)
    if (!reset) {
      return res.status(400).json({ error: "Failed to reset incident" })
    }

    res.json(reset)
  } catch (error) {
    console.error("Error resetting incident:", error)
    res.status(500).json({ error: "Failed to reset incident" })
  }
})

/*
  POST /api/incidents/bulk-upload
  Bulk uploads incidents from a CSV file
  Form data: file (CSV file)
 
  Purpose: Allows importing multiple incidents at once from a CSV file
  Workflow:
  1. Receives CSV file via multipart form upload
  2. Parses CSV into array of row objects
  3. Validates each row using validateCreateIncident
  4. Creates incidents for valid rows, skips invalid rows
  5. Saves all created incidents to file
  6. Returns summary: total rows, created count, skipped count
 
  CSV format expected:
  title,description,category,severity
  "Bug report","System crashed","IT","HIGH"
  ...
 */
router.post("/bulk-upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" })
    }

    const records = await parseCsvBuffer(req.file.buffer)

    let created = 0
    let skipped = 0

    // Process each CSV row
    for (const row of records) {
      const result = validateCreateIncident(row)
      if (!result.ok) {
        skipped++
        continue
      }
      await createIncident(result.value)
      created++
    }

    res.json({
      totalRows: records.length,
      created,
      skipped,
    })
  } catch (error) {
    console.error("Error during bulk upload:", error)
    res.status(500).json({ error: "Failed to process bulk upload" })
  }
})

export default router
