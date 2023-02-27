const express = require('express');
const { Schema } = require('mongoose');


const router = express.Router();
const MainChatLogs = require('../models/Mainchatlogs')


router.get('/', async (req, res) => {
    const logs = await MainChatLogs.find()
    res.send(logs)
});

router.post('/', async (req, res) => {
    MainChatLogs.create(req.body).then((result)=>{
        res.send(result);
    }).catch((error)=>{
        res.status(400);
        res.end();
    });
});

router.delete('/:id', async (req, res) => {
    try{
        await MainChatLogs.deleteOne({_id:req.params.id})
        res.status(204).send()
    } catch{
        res.status(404)
        res.send({error:"User doesn't exist"})
    }

});

router.delete('/', async (req, res) => {
    try{
        await MainChatLogs.deleteMany({})
        res.status(204).send()
    } catch{
        res.status(404)
        res.send({error:"User doesn't exist"})
    }
});

router.patch('/:id', async (req, res) => {
    MainChatLogs.findOneAndUpdate({"_id":req.params.id},req.body,{new:true})
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