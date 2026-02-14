# Incident Management System - Week 5

A full-stack incident tracking and management system with file-based persistence, status workflow, and archiving capabilities.

## 📋 Project Overview

This system manages incidents across different categories (IT, Safety, Facilities, Other) with a complete workflow from creation through investigation to resolution and archival.

### Key Features

**File Persistence** - JSON-based storage for data durability  
**Status Workflow** - OPEN → INVESTIGATING → RESOLVED → ARCHIVED  
**Archive Management** - Archive and restore incidents  
**Bulk Upload** - CSV import for multiple incidents  
**Dashboard** - Real-time KPIs and status-based views  
**Configuration** - Centralized config.js file  
**REST API** - Complete CRUD operations

### Technology Stack

- **Backend**: Node.js, Express.js
- **Frontend**: Next.js (React)
- **Storage**: JSON file persistence
- **Upload**: Multer for CSV processing

## Quick Start

### Prerequisites

- Node.js 14+ and npm
- Git (optional)

### Installation

1. **Clone or extract the project**

   ```bash
   cd Week_5
   ```

2. **Start both servers** (automated)

   **Windows:**

   ```bash
   app-start.bat
   ```

   **Linux/Mac:**

   ```bash
   chmod +x app-start.sh
   ./app-start.sh
   ```

3. **Manual start** (alternative)

   **Backend:**

   ```bash
   cd backend
   npm install
   npm start
   ```

   **Frontend:**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the application**

   Open browser to: `http://localhost:3000`

## 📁 Project Structure

```
Week_5/
├── backend/
│   ├── config.js                 # Configuration file
│   ├── server.js                 # Server entry point
│   ├── package.json              # Dependencies
│   ├── data/                     # Data storage directory
│   │   └── incidents.json        # Incidents data file
│   └── src/
│       ├── app.js                # Express app setup
│       ├── routes/
│       │   └── incidents.routes.js  # API endpoints
│       ├── store/
│       │   └── incidents.store.js   # Data layer
│       └── utils/
│           ├── csv.js            # CSV parsing
│           └── validate.js       # Validation logic
├── frontend/
│   ├── package.json              # Dependencies
│   ├── pages/
│   │   ├── index.js              # Home page
│   │   ├── dashboard.js          # Dashboard view
│   │   ├── bulk-upload.js        # CSV upload
│   │   └── incidents/
│   │       ├── index.js          # Incidents list
│   │       ├── create.js         # Create form
│   │       └── [id].js           # Detail/Edit view
│   ├── components/
│   │   ├── Layout.js             # Page layout
│   │   └── ErrorBanner.js        # Error display
│   ├── services/
│   │   └── api.js                # API client
│   └── styles/
│       └── globals.css           # Global styles
├── incident.csv                  # Sample CSV file
├── incident_extended.csv         # Extended sample
├── DOCUMENTATION.md              # Detailed documentation
├── PROJECT_DOCUMENTATION.pdf     # PDF documentation
└── README.md                     # This file
```

## 🔧 Configuration

Edit `backend/config.js` to customize:

- **Server settings** (port, host, CORS)
- **Storage paths** (data file location)
- **Status transitions** (workflow rules)
- **Validation rules** (length limits)
- **Categories and severities**

Example:

```javascript
server: {
  port: 3001,
  host: 'localhost',
  corsOrigin: 'http://localhost:3000'
}
```

## 📖 Usage Guide

### Creating Incidents

1. Navigate to "Create Incident"
2. Fill in:
   - Title (5-200 characters)
   - Description (10-2000 characters)
   - Category: IT, Safety, Facilities, or Other
   - Severity: Low, Medium, or High
3. Click "Create"
4. Incident starts in OPEN status

### Managing Incidents

**View Dashboard:**

- See KPI cards (Total, Open, Investigating, Resolved, Archived, High Severity)
- View incidents organized by status columns
- Toggle "Show Archived" checkbox to include/exclude archived incidents

**Update Status:**

1. Click on an incident
2. Select next status from dropdown
3. Click "Update"
4. Status follows workflow: OPEN → INVESTIGATING → RESOLVED

**Archive Incident:**

1. Open an incident in OPEN or RESOLVED status
2. Click "Archive" button
3. Incident moves to ARCHIVED status
4. Hidden from dashboard by default

**Reset Incident:**

1. Open an archived incident
2. Click "Reset to Open"
3. Incident returns to OPEN status
4. Re-enters normal workflow

### Bulk Upload

1. Prepare CSV file with columns:
   ```
   title,description,category,severity
   ```
2. Navigate to "Bulk Upload"
3. Select CSV file
4. Click "Upload"
5. View summary of created/skipped records

Sample CSV (`incident.csv` included):

```csv
title,description,category,severity
"Server outage","Production server down","IT","HIGH"
"Broken door","Office door broken","FACILITIES","MEDIUM"
```

## 🔄 Status Workflow

```
OPEN
 ├─→ INVESTIGATING
 │    └─→ RESOLVED
 │         └─→ ARCHIVED
 └─→ ARCHIVED (direct)
      └─→ OPEN (reset)
```

**Rules:**

- OPEN can go to: INVESTIGATING or ARCHIVED
- INVESTIGATING can go to: RESOLVED
- RESOLVED can go to: ARCHIVED
- ARCHIVED can go to: OPEN (reset only)

## 🎯 API Endpoints

### Health Check

```
GET /health
Response: { "status": "ok" }
```

### List Incidents

```
GET /api/incidents?includeArchived=true/false
Response: [{ id, title, description, ... }]
```

### Get Incident

```
GET /api/incidents/:id
Response: { id, title, description, category, severity, status, reportedAt }
```

### Create Incident

```
POST /api/incidents
Body: { title, description, category, severity }
Response: Created incident (201)
```

### Update Status

```
PATCH /api/incidents/:id/status
Body: { status }
Response: Updated incident
```

### Archive

```
POST /api/incidents/:id/archive
Response: Archived incident
```

### Reset

```
POST /api/incidents/:id/reset
Response: Reset incident
```

### Bulk Upload

```
POST /api/incidents/bulk-upload
Form-data: file (CSV)
Response: { totalRows, created, skipped }
```


**Auto-save:** Enabled by default (configurable in config.js)

## 🐛 Troubleshooting

### Backend won't start

- Check port 3001 is available
- Verify Node.js installed: `node --version`
- Check data directory permissions

### Frontend won't connect

- Ensure backend is running on port 3001
- Check browser console for errors
- Verify CORS configuration

### Data not saving

- Check auto-save is enabled in config.js
- Verify write permissions on data directory
- Check backend console for errors

### Status transition fails

- Review allowed transitions in config.js
- Ensure current status allows requested transition
- Check validation errors in browser console


**Backend Port:** 3001  
**Frontend Port:** 3000
