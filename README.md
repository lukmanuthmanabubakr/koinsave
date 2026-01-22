# Koinsave Backend API

A clean backend API for a mock wallet system. It supports user authentication, automatic wallet creation, transfers in naira, overdraft protection, double-spending prevention, and transaction history.  
All endpoints are fully documented through Swagger.

---

## Features
- User registration and login (JWT)
- Automatic wallet creation per user
- Wallet balance (returned in naira)
- Transfer money between users (naira input)
- Prevents overdraft and double spending
- Transaction history
- Swagger API documentation

---

## Tech Stack
- Node.js (Express)
- MongoDB (Mongoose)
- JWT Authentication
- Swagger (OpenAPI)

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Environment variables
Create a `.env` file in the root:

```env
PORT=4040
MONGO_URI=mongodb://127.0.0.1:27017/koinsave
JWT_SECRET=change_me
JWT_EXPIRES_IN=1d
```

### 3. Run the project

Development:
```bash
npm run dev
```

Production:
```bash
npm start
```

---

## API Documentation
Swagger UI:  
http://localhost:4040/docs

---

## Quick Test Flow

### 1. Register Sender  
**POST /api/v1/auth/register**
```json
{
  "fullName": "Legend Dev",
  "email": "legend@test.com",
  "password": "password123"
}
```

### 2. Register Receiver  
**POST /api/v1/auth/register**
```json
{
  "fullName": "Receiver",
  "email": "receiver@test.com",
  "password": "password123"
}
```

### 3. Login Sender  
**POST /api/v1/auth/login**
```json
{
  "email": "legend@test.com",
  "password": "password123"
}
```

Copy the token from the response.

### 4. Authorize in Swagger  
Open `/docs`  
Click **Authorize**  
Enter:
```
Bearer <token>
```

### 5. Check Sender Wallet  
**GET /api/v1/wallet/me**

### 6. Transfer ₦50  
**POST /api/v1/transactions/transfer**
```json
{
  "toUserEmail": "receiver@test.com",
  "amount": 50
}
```

### 7. View Transaction History  
**GET /api/v1/transactions/me**

---

## Notes
- All amounts in requests and responses are in **naira**.
- Internally, balances are stored in kobo but converted back to naira before returning.
- Wallets are created automatically when a user registers.

---
