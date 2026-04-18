# Aadinath Apartment - Problem Management System

## How to Run

### Prerequisites
- Node.js installed
- MongoDB installed and running locally

### 1. Start MongoDB
Make sure MongoDB is running on your machine (default port 27017)

### 2. Start Backend
```
cd backend
npm start
```
Server runs on: http://localhost:5000

### 3. Start Frontend
```
cd frontend
npm run dev
```
App runs on: http://localhost:5173

---

## Features
- **Residents** can submit complaints with:
  - Full address (Wing + Floor + Flat Number)
  - Name & Phone
  - Problem Type (Plumber, Carpenter, Electrician, Painter, Cleaner, Other)
  - Description
  - Image upload (optional)

- **Manager Dashboard** can:
  - View all complaints with stats
  - Filter by Status and Problem Type
  - Update status: Pending → In Progress → Resolved
  - View uploaded images (click to enlarge)
  - Delete complaints
