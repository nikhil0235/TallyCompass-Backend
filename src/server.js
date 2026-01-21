const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Load env vars FIRST
dotenv.config();

const connectDB = require('../config/database');
const corsOptions = require('../config/cors');
const config = require('../config/config');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));

app.get('/', (req, res) => {
    res.send('API is running...');
});

connectDB().then(() => {
    app.listen(config.PORT, () => {
        console.log(`Server running on port ${config.PORT}`);
    });
});
