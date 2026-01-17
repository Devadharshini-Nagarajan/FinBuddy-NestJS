# FinBuddy Backend ⚙️  
Backend API for the FinBuddy budgeting application

## Overview
This repository contains the **backend implementation for FinBuddy**, a personal finance and monthly budgeting application.

The backend is built using **Next.js** and follows a clean, scalable API-first architecture.  
It handles authentication, data persistence, and business logic for budgets, categories, and expense items.

---

## Tech Stack

- **Next.js** – Backend framework and API routes
- **Prisma ORM** – Database access and schema management
- **PostgreSQL** – Primary database
- **Neon** – Serverless PostgreSQL hosting
- **JWT Authentication** – Secure user authentication

---

## Database & ORM
- Prisma is used as the ORM for interacting with PostgreSQL.
- The database schema is designed around core financial entities such as:
  - Users
  - Categories
  - Monthly Budgets
  - Budget Categories
  - Expense Items
- The schema supports **per-user data isolation** and **month-based budgeting**.

---

## Key Responsibilities
- User authentication and authorization
- CRUD APIs for categories, budgets, and expenses
- Monthly budget and category-limit management
- Secure data access using JWT-based guards

---

## Planned Enhancements (Work in Progress)

- Support for **additional authentication methods**
  - OAuth providers
  - Token refresh and session strategies
- **AI integration**
  - Monthly spending insights
  - Budget recommendations
  - Conversational AI queries (shared with frontend roadmap)
- Receipt parsing support to automatically create expense items

---

## Frontend Application
The frontend for this project is built as part of an Angular workspace.

👉 **Frontend Repository:**  
https://github.com/Devadharshini-Nagarajan/angular-workspace

---

## Status
- Core APIs implemented and functional
- Database schema stabilized
- Actively evolving alongside frontend features
