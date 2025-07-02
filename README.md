# 🏦 Bank App - Node.js + PostgreSQL

A simple banking application built with **Node.js** and **PostgreSQL**, supporting key features such as user registration, authentication, account management, and secure financial transactions (deposit, withdraw, transfer).

---

## 🚀 Features

-   ✅ User registration with automatic account creation
-   ✅ Secure login with password hashing
-   ✅ Deposit to own account
-   ✅ Withdraw from own account
-   ✅ Transfer to other accounts
-   ✅ Safe balance handling (precision-safe using DECIMAL)
-   ✅ Transaction logs per action
-   ✅ Protection against race conditions via DB transactions

---

## 🛠️ Tech Stack

| Layer        | Stack                     |
| ------------ | ------------------------- |
| Runtime      | Node.js                   |
| Database     | PostgreSQL                |
| ORM          | Sequelize                 |
| Validation   | Custom & Sequelize native |
| Hashing      | bcrypt / crypto           |
| Format Money | decimal.js (recommended)  |
| Architecture | Clean Architecture        |

---

## 📁 Project Structure

```
BANK-APP-NODEJS/
├── migrations/           # Manual or CLI-based DB migration files
├── src/
│   ├── connections/      # DB connection setup
│   ├── handlers/         # HTTP route handlers (controllers)
│   ├── models/           # Sequelize models
│   ├── repositories/     # Database access abstraction layer
│   ├── router/           # HTTP Router
│   ├── usecases/         # Business logic (e.g. register, transfer)
│   └── utils/            # Helper functions (hashing, money, etc)
├── app.js                # Express app
├── index.js              # Entry point (starts the server)
├── .env                  # Environment variables
├── package.json
└── README.md
```

---

## 🧪 Available Endpoints (Sample)

| Method | Endpoint            | Description                 |
| ------ | ------------------- | --------------------------- |
| POST   | `/user/register`    | Register new user + account |
| POST   | `/user/login`       | Authenticate user           |
| POST   | `/account/deposit`  | Deposit to account          |
| POST   | `/account/withdraw` | Withdraw from account       |
| POST   | `/account/transfer` | Transfer to other account   |

_All transactions use Sequelize `transaction()` to prevent race conditions._

---

## 🛡️ Balance Safety

-   Balance is stored using `DECIMAL(18,2)` in PostgreSQL.
-   Handled using `decimal.js` in application layer to avoid JS floating-point errors.

---

## 📦 Install & Run

```bash
# Clone repo
git clone https://github.com/putraawali/bank-app-nodejs.git
cd bank-app-nodejs

# Install dependencies
npm install

# Configure ENV Variable (in .env.example)

# Run migrations
npm run migrate

# Start app
npm start
```

---

## 🧰 Suggested Enhancements

-   JWT-based session authentication
-   Transaction history endpoint
-   Account lockout after failed PIN attempts
-   Unit testing with Jest or Mocha
-   API documentation with Swagger

---
