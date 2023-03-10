const express = require('express');
const app = express();
const cors = require('cors')
const mainchatlogs = require('./routes/mainchatlogs');
const users = require('./routes/users')
const game = require("./routes/game")
const Highscore = require("./routes/highscore")
app.use(express.json());
app.use(cors())

app.use('/mainchatlogs', mainchatlogs);
app.use('/users', users);
app.use('/game',game)
app.use("/score",Highscore)
require('dotenv').config();
const dbConnData = {
    host: process.env.MONGO_HOST || '127.0.0.1',
    port: process.env.MONGO_PORT || 27017,
    database: process.env.MONGO_DATABASE || 'local'
};


const mongoose = require('mongoose');

mongoose
    .connect(`mongodb://${dbConnData.host}:${dbConnData.port}/${dbConnData.database}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(response => {
        console.log(`Connected to MongoDB. Database name: "${response.connections[0].name}"`)
        const port = process.env.PORT || 5000
        app.listen(port, () => {
            console.log(`API server listening at http://localhost:${port}`);
        });
    })
    .catch(error => console.error('Error connecting to MongoDB', error));
