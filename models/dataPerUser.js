mongoose = require('mongoose');

const dataPerUserSchema = new mongoose.Schema({
    username:{
        type: String,
        trim: true
    },
    movieId:{
        type: String,
        trim: true
    },
    titlename:{
        type: String,
        trim: true
    },
    titleimage:{
        type: String
    },
    titleType:{
        type: String
    },
    status:{
        type: Number
    },
    my_rating:{
        type: Number
    },
    time:{ 
        type: Number, 
        default: (new Date()).getTime() 
    },
    favorite:{
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('DPU', dataPerUserSchema);