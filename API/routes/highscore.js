const express = require('express');
const { Schema } = require('mongoose');


const router = express.Router();
const Highscore = require('../models/Highscore')

router.get('/', async (req, res) => {
    const users = await Highscore.find()
    res.send(users)
});

router.post('/', async (req, res) => {
    Highscore.create(req.body).then((result)=>{
        res.send(result);
    }).catch((error)=>{
        console.log(error)
        res.status(400);
        res.end();
    });
});

router.get('/:login', async (req, res) => {
    const user = await Highscore.findOne({ login: req.params.login })
    if (user===null){
        res.status(400)

    }
    res.send(user)
});

router.delete('/:id', async (req, res) => {
    try{
        await Highscore.deleteOne({_id:req.params.id})
        res.status(204).send()
    } catch{
        res.status(404)
        res.send({error:"User doesn't exist"})
    }
});

router.patch('/:login', async (req, res) => {
    Highscore.findOneAndUpdate({"login":req.params.login},req.body,{new:true})
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