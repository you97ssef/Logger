---
applyTo: "mobile"
---

# Project Overview

# Logger Mobile App

The Logger mobile app enables users to monitor logs in real time, receive push notifications, manage profiles, and view alerts from anywhere. It is cross-platform (iOS/Android) and focuses on usability, security, and performance.

## Folder Structure

# Recommended Structure

```
mobile/
├── src/
│   ├── components/      # Reusable UI components
│   ├── screens/         # App screens (Login, LogTail, Alerts, Profile)
│   ├── navigation/      # Navigation setup
│   ├── store/           # Zustand state management
│   ├── api/             # Axios API calls
│   ├── utils/           # Utility functions
│   ├── assets/          # Images, icons
│   └── ...
├── App.js               # Entry point
├── app.json             # Expo config
└── ...
```

## Libraries and Frameworks already installed

# Tech Stack

-   **React Native (Expo)**: Cross-platform mobile development
-   **Zustand**: State management
-   **Axios**: Networking/API calls
-   **AsyncStorage / SQLite**: Local storage and caching
-   **Expo Notifications**: Push notifications

## Coding Standards

# Guidelines

-   Use functional components and hooks
-   Organize code by feature/screen
-   Use Zustand for state management
-   Write clean, readable code with comments
-   Follow Expo and React Native best practices
-   Use TypeScript if possible for type safety

## UI guidelines

# UI/UX Principles

-   Simple, intuitive navigation
-   Responsive layouts for all devices
-   Clear log filtering and search options
-   Prominent alert and notification displays
-   Support for biometric authentication (fingerprint/Face ID)
-   Consistent color scheme and branding
