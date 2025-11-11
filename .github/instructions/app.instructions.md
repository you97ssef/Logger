---
applyTo: "app"
---

# Project Overview

# Logger Web App (Dashboard & API)

The Logger web app is the main dashboard and API backend for log management, real-time monitoring, notifications, and user profile management. Built with Go (Gin) for backend and Angular for frontend, it follows DDD and Clean Architecture.

## Folder Structure

# Recommended Structure

```
app/
├── backend/
│   ├── domain/           # Core business logic (entities, aggregates)
│   ├── application/      # Use cases, orchestration
│   ├── infrastructure/   # DB, logging, email, WebSocket
│   ├── interfaces/       # API endpoints
│   ├── config/           # Viper config files
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── app/          # Angular modules/components
│   │   ├── assets/       # Images, icons
│   │   ├── environments/ # Environment configs
│   │   └── ...
│   └── ...
└── ...
```

## Libraries and Frameworks already installed

# Tech Stack

-   **Go + Gin**: Backend API and routing
-   **GORM**: ORM for PostgreSQL
-   **Zerolog**: Structured logging
-   **Viper**: Config management
-   **SMTP (via standard library)**: Email notifications
-   **Gorilla/WebSocket**: Real-time log streaming
-   **JWT + OAuth2**: Authentication
-   **Angular**: Frontend dashboard

## Coding Standards

# Guidelines

-   Follow DDD and Clean Architecture
-   Use dependency injection and interfaces
-   Use environment variables for secrets/config
-   Modularize Angular components and services
-   Document APIs with Swagger/OpenAPI

## UI guidelines

# UI/UX Principles

-   Responsive dashboard for desktop and mobile
-   Clear navigation and role-based access
-   Real-time log tailing and filtering
-   Notification and alert management
-   User profile and settings management
-   Consistent design and branding
