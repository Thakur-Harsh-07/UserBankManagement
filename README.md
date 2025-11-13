# Bank User Management System

A full-stack web application for managing bank users and their accounts. This system provides user authentication, bank account management, and administrative features.

## Features

### User Features
- 🔐 User registration and authentication (JWT-based)
- 👤 User profile management
- 🏦 Bank account CRUD operations
  - Add bank accounts
  - View all bank accounts
  - Update bank account details
  - Delete bank accounts
- 🔒 Protected routes with authentication middleware

### Admin Features
- 👥 View all registered users
- 📊 View all bank accounts across all users
- 🛡️ Role-based access control (Admin-only routes)

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** (jsonwebtoken) - Authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend
- **React** - UI library
- **React Router** - Routing
- **Axios** - HTTP client
- **Vite** - Build tool and dev server
- **React Hot Toast** - Notifications
- **Context API** - State management for authentication

## Project Structure

```
BankUserManagement/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── bankController.js    # Bank account CRUD
│   │   └── adminController.js   # Admin operations
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT verification & admin check
│   ├── models/
│   │   ├── user.js              # User schema
│   │   └── BankAccount.js       # Bank account schema
│   ├── routes/
│   │   ├── userRoutes.js        # Auth routes
│   │   ├── bankRoutes.js        # Bank account routes
│   │   └── adminRoutes.js       # Admin routes
│   ├── index.js                 # Server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Auth state management
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── BankAccounts.jsx
│   │   │   └── AdminPanel.jsx
│   │   ├── services/
│   │   │   └── api.js           # API service
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── .gitignore
```

## Prerequisites

Before running this application, make sure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local or cloud instance like MongoDB Atlas)

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd BankUserManagement
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=3000
DATABASE_URL=mongodb://localhost:27017/bankuserdb
JWT_SECRET=your_super_secret_jwt_key_here
```

**Important**: Replace `DATABASE_URL` with your MongoDB connection string. If using MongoDB Atlas, use your Atlas connection string.
Replace `JWT_SECRET` with a strong, random secret key.

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

## Running the Application

### Development Mode

1. **Start the Backend Server**

```bash
cd backend
npm run dev
```

The backend server will run on `http://localhost:3000`

2. **Start the Frontend Development Server**

Open a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

### Production Mode

1. **Build the Frontend**

```bash
cd frontend
npm run build
```

2. **Start the Backend Server**

```bash
cd backend
npm start
```

## API Endpoints

### Authentication (`/api/v1/auth`)

- `POST /api/v1/auth/register` - Register a new user
  - Body: `{ username, email, password, role? }`
  
- `POST /api/v1/auth/login` - Login user
  - Body: `{ email, password }`
  
- `GET /api/v1/auth/profile` - Get user profile (Protected)
  - Headers: `Authorization: Bearer <token>`

### Bank Accounts (`/api/v1/bank`)

All routes require authentication token in headers.

- `POST /api/v1/bank/addBank` - Create a new bank account
  - Body: `{ ifscCode, branchName, bankName, accountNumber, accountHolderName }`
  
- `GET /api/v1/bank` - Get all bank accounts for the logged-in user
  
- `GET /api/v1/bank/:id` - Get a specific bank account by ID
  
- `PUT /api/v1/bank/:id` - Update a bank account
  
- `DELETE /api/v1/bank/:id` - Delete a bank account

### Admin (`/api/v1/admin`)

All routes require admin authentication.

- `GET /api/v1/admin/users` - Get all users (Admin only)
  
- `GET /api/v1/admin/bank-accounts` - Get all bank accounts (Admin only)

## Environment Variables

### Backend `.env` file

```env
PORT=3000                                    # Server port
DATABASE_URL=mongodb://localhost:27017/bankuserdb  # MongoDB connection string
JWT_SECRET=your_super_secret_jwt_key_here   # JWT secret key (keep this secure!)
```

**Security Note**: Never commit your `.env` file to version control. The `.gitignore` file already includes `.env` files.

## Database Schema

### User Model
- `username` (String, required)
- `email` (String, required, unique)
- `password` (String, required, hashed)
- `role` (String, enum: ['user', 'admin'], default: 'user')
- `createdAt` (Date)

### BankAccount Model
- `user` (ObjectId, ref: User, required)
- `ifscCode` (String, required)
- `branchName` (String, required)
- `bankName` (String, required, indexed)
- `accountNumber` (String, required)
- `accountHolderName` (String, required)
- `createdAt` (Date)

## Security Features

- 🔒 Password hashing with bcrypt
- 🎫 JWT-based authentication
- 🛡️ Protected routes with middleware
- 👮 Role-based access control (RBAC)
- 🔐 Environment variables for sensitive data
- ✅ Input validation and sanitization

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Author

Your Name

## Support

For support, please open an issue in the repository or contact [your-email@example.com]

