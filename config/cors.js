const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://tallycompass.netlify.app',
    'https://tallyinterect.onrender.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

module.exports = corsOptions;