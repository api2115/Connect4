const {Schema,model} = require('mongoose')

const usersSchema = new Schema({
    login:{
        type:String,
        required: true,
        unique:true
    },
    password: {
        type:String,
        required: true
    },
    won: {
        type:Number,
        required: true
    },
    role:{
        type:String,
        required: true
    }
})

module.exports = model('Users',usersSchema)