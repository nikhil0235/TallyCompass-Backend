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
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors(corsOptions));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/products', require('./routes/productRoutes'));

app.use('/api/voc', require('./routes/vocRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));
app.use('/api/customerrequest', require('./routes/customerRequestRoutes'));
app.use('/api/features', require('./routes/featureRoutes'));
app.use('/api/search', require('./routes/searchRoutes'));
app.use('/api/media', require('./routes/mediaRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/forms', require('./routes/formRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/meetings', require('./routes/meetingRoutes'));


app.get('/', (req, res) => {
    res.send('API is running...');
});


const http = require('http');
const { setSocketIO } = require('./socket');

const server = http.createServer(app);
setSocketIO(server);

connectDB().then(() => {
    server.listen(config.PORT, () => {
        console.log(`Server running with Socket.IO on port ${config.PORT}`);
    });
});
