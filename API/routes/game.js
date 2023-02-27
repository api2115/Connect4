const express = require('express');
const { Schema } = require('mongoose');


const router = express.Router();
const Game = require("../models/Game")

router.get('/', async (req, res) => {
    const game = await Game.find()
    res.send(game)
});

router.post('/', async (req, res) => {
    Game.create(req.body).then((result)=>{
        res.send(result);
    }).catch((error)=>{
        console.log(error)
        res.status(400);
        res.end();
    });
});

router.get('/:id', async (req, res) => {
    const game = await Game.findOne({ _id: req.params.id })
    if (game===null){
        res.status(400)

    }
    res.send(game)
});

router.delete('/:id', async (req, res) => {
    try{
        await Game.deleteOne({_id:req.params.id})
        res.status(204).send()
    } catch{
        res.status(404)
        res.send({error:"User doesn't exist"})
    }
});

router.patch('/:id', async (req, res) => {
    Game.findOneAndUpdate({"_id":req.params.id},req.body,{new:true})
        .then((response)=>{
            if(!response){
                res.status(404).end()
            }
            else{
                res.send(response)
            }
        })
        .catch(()=>res.status(400).end)
});

module.exports = router;
