const express = require('express');
const app = express();
const connectDB = require('./config/database');
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 3000;

// Connect to Database
connectDB();

app.use(express.json());

// cors
const cors = require('cors');
app.use(
    cors({
        origin: "https://user-bank-management.vercel.app",
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
    })
)

// Define Routes
const userRoutes = require('./routes/userRoutes');
const bankRoutes = require('./routes/bankRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/bank', bankRoutes);
app.use('/api/v1/admin', adminRoutes);



// Start the server
app.get('/', (req, res) => {
    res.send('Bank User Management API is running');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});