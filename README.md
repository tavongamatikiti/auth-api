# Auth API

### Overview

**Auth API** is a RESTful authentication API built using **Node.js**, **Express**, and **MongoDB**. It provides secure user authentication and authorization features such as user registration, login, token-based authentication (JWT), and more.

### Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

---

### Features

- User registration with hashed passwords (bcrypt)
- User login with JWT-based authentication
- Token validation and refreshing
- Protected routes for authorized users
- MongoDB database integration
- Middleware for authentication and authorization

---

### Tech Stack

- **Node.js** - Server-side runtime
- **Express** - Web framework for Node.js
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - JSON Web Tokens for secure authentication
- **bcrypt** - Password hashing for security

---

### Installation

#### Prerequisites
- [Node.js](https://nodejs.org/) (v12 or later)
- [MongoDB](https://www.mongodb.com/)

#### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/tavongamatikiti/auth-api.git
   cd engine
    ```
   
---

2. Install dependencies:
   ```bash
   yarn install
   ```
---

3. Set up environment variables:
   Create a `.env` file in the root of the project and add the following:
   ```bash
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/auth-db
   JWT_SECRET=your_jwt_secret
   GMAIL_USER=john@example.com
   GMAIL_PASSWORD=yourpassword
   ```
   
---

#### **Important: Enable 2FA and App Password for Gmail**

To send OTPs using Gmail, you need to **enable 2-factor authentication (2FA)** for the Gmail account you're using and create an **App Password** to use in the `GMAIL_PASSWORD` field.

**Steps to set up 2FA and App Password:**
1. Log in to your Gmail account.
2. Go to **Account Security Settings**.
3. Enable **2-Step Verification** (2FA).
4. Once 2FA is enabled, navigate to **App Passwords**.
5. Create a new App Password for "Mail" and "Other" (name it something like "Auth API").
6. Copy the generated App Password and use it as the `EMAIL_PASSWORD` in your `.env` file.

This is required to ensure secure access to Gmail for sending OTPs from the API.

---

4. Start the development server:
   ```bash
   yarn start
   ```

---

### Usage

#### Running the API
Once the server is running, you can interact with the API using tools like [Postman](https://www.postman.com/) or [IntelliJ HTTP Client](https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html). Below are the available API endpoints.

---

#### API Endpoints

| Method | Endpoint                    | Description                |
|--------|-----------------------------|----------------------------|
| POST   | `/api/auth/login`           | User login                 |
| POST   | `/api/auth/register`        | User registration           |
| POST   | `/api/auth/logout`          | User logout                |
| POST   | `/api/auth/verify-otp`      | OTP for user login         |
| POST   | `/api/auth/forgot-password` | Request password reset     |
| DELETE | `/api/auth/:id`             | Delete user profile        |
| PUT    | `/api/auth/:id`             | Update user profile        |

#### Example Requests

1. **Registration:**
   ```http
   POST /api/auth/register
   Content-Type: application/json
   {
     "name": "John",
     "email": "john@example.com",
     "password": "securePassword123"
   }
   ```

2.  **Login:**
   ```http
   POST /api/auth/login
   Content-Type: application/json
   {
     "email": "john@example.com",
     "password": "securePassword123"
   }
   ```

3. **Verify OTP:**
   ```http
   POST /api/auth/register
   Content-Type: application/json
   {
     "email": "john@example.com",
     "otp": "otpcode"
   }
   ```

4. **Logout:**
   ```http
   GET /api/auth/register
   Content-Type: application/json
   Authorization: Bearer {token}
   {
     "email": "john@example.com",
     "otp": "otpcode"
   }
   ```

---

### Contributing

Contributions are welcome! If you want to contribute to this project, follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/new-feature`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add new feature'`).
5. Push to the branch (`git push origin feature/new-feature`).
6. Open a pull request.

---

### License

This project is licensed under the MIT License.

---

### Contact

If you have any questions or issues, feel free to reach out!
```