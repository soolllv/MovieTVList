const mongoose =  require('mongoose');

const friendsSchema = new mongoose.Schema({
    username:{
        type: String,
        trim: true
    },
    friends:[String]
})
// mongoose.set('useFindAndModify', false);

module.exports = mongoose.model('Friends', friendsSchema);