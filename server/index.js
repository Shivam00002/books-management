require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');

const app = express();


connectDB();

const corsOptions = {
    origin: [process.env.FRONTEND_URL, "http://localhost:3000" , "books-management-ocb5.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
};


app.use(cors(corsOptions));
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Welcome to the Books Management API 🔥📚');
});


app.use('/auth', authRoutes);
app.use('/books', bookRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
