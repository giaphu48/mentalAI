const mongoose = require('mongoose');

const ClientProfileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    dateOfBirth: {
        type: Date
    },
    address: {
        type: String,
        trim: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ClientProfile', ClientProfileSchema);