const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const clickSchema = Schema({
    _id:Number,
    clickX: Number,
    clickY: Number
})

let Click = mongoose.model('Click', clickSchema,'Clicks');

module.exports = Click;