const {Schema,model} = require('mongoose')

const mainchatlogsSchema = new Schema({
    login:{
        type:String,
        required: true
    },
    message: {
        type:String,
        required: true
    }
})

module.exports = model('MainChatLogs',mainchatlogsSchema)