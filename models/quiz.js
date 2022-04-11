var mongoose = require('mongoose')

var quizSchema = mongoose.Schema({
    quizname: {
        type: String,
        required: [true, 'quizname is required']
    },
    quizdescription: {
        type: String,
        required: [true, 'quizdescription is required']
    },
    upload:{
        type: Boolean, default: false
    }
})

module.exports = mongoose.model('quiz', quizSchema)