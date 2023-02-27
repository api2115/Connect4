const {Schema,model} = require('mongoose')

const Highscoreschema = new Schema({
    login:{
        type:String,
        required: true,
        unique:true
    },
    score:{
        type:Number,
        required: true
    }
})

module.exports = model('Highscoreschema',Highscoreschema)