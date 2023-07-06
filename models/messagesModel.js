const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const msgSchema = new mongoose.Schema({
    msg: {
        type: String,
        required: true
    },
    name: {
        type: String,
    },
    photo: {
        type: String
    }
    // msg: [
    //     {
    //         msg: String,
    //         name: String,
    //         photo: String
    //     }
    // ]
})

const Msg = mongoose.model('msg', msgSchema);
module.exports = Msg;