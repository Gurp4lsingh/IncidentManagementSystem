/*
 Configuration File
 This file contains all configuration settings for the Incident Management System backend.
 It centralizes configuration to allow easy modification of system behavior.
 */

export const config = {
  // Server Configuration
  server: {
    port: 3001,
    host: "localhost",
    corsOrigin: "http://localhost:3000",
  },

  // Data Storage Configuration
  storage: {
    // File path for incidents data persistence
    incidentsFilePath: "./data/incidents.json",
    // Enable/disable auto-save on every change
    autoSave: true,
    // Backup configuration
    enableBackup: false,
    backupInterval: 3600000, // 1 hour in milliseconds
  },

  // Incident Status Configuration
  incidents: {
    // Valid incident statuses
    statuses: ["OPEN", "INVESTIGATING", "RESOLVED", "ARCHIVED"],

    // Status transition rules
    statusTransitions: {
      OPEN: ["INVESTIGATING", "ARCHIVED"],
      INVESTIGATING: ["RESOLVED"],
      RESOLVED: ["ARCHIVED"],
      ARCHIVED: ["OPEN"],
    },

    // Valid categories
    categories: ["IT", "SAFETY", "FACILITIES", "OTHER"],

    // Valid severity levels
    severities: ["LOW", "MEDIUM", "HIGH"],
  },

  // Validation Rules
  validation: {
    title: {
      minLength: 5,
      maxLength: 200,
    },
    description: {
      minLength: 10,
      maxLength: 2000,
    },
  },

  // Bulk Upload Configuration
  bulkUpload: {
    maxFileSize: 5242880, // 5MB in bytes
    allowedMimeTypes: ["text/csv", "application/vnd.ms-excel"],
  },

  // Dashboard Configuration
  dashboard: {
    // Whether to show archived incidents by default
    showArchivedByDefault: false,
  },
}
