const {Schema,model} = require('mongoose')

const Game = new Schema({
    players:{
        type:Array,
        required:true
    },
    gamechat:{
        type:Array,
        required:true
    },
    gamespace:{
        type:Array,
        required:true
    },
    turn:{
        type:Number,
        required:true
    },
    color:{
        type:String,
        required:true
    },
})

module.exports = model("Game",Game)