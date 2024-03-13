const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    is_online: {
        type: String,
        default: '0'
    },
    image: {
        type: String,
        require: true
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.model('User', userSchema)