const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    children: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student'
    }],
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin'
    },
    role: {
        type: String,
        default: "Parent"
    }
}, { timestamps: true });

module.exports = mongoose.model("parent", parentSchema);
