const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    genre: {
        type: String,
        required: true,
    },
    yearOfPublishing: {
        type: Number,
        required: true,
    },
    isbn: {
        type: String,
        required: true,
        unique: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Book', BookSchema);