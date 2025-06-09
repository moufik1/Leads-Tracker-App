# Leads Tracker 🔗

![App Screenshot](/screenshot.png) *(add a screenshot later)*

A lightweight URL manager that saves leads to Firebase Realtime Database.

## Features
- One-click URL saving
- Double-tap protected delete
- Installable PWA
- Cross-device sync

## Tech Stack
- Firebase Realtime Database
- Vanilla JavaScript
- Progressive Web App (PWA)

## Installation
1. Clone the repo
```bash
git clone https://github.com/your-username/leads-tracker.git
```
2. Open `index.html` in browser

## Configuration
Set up your Firebase config in `config.js`:
```javascript
const ENV = {
  DATABASE_URL: "your-firebase-url"
};
```