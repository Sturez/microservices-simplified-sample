const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');


const app = express();
app.use(bodyParser.json());


app.post('/events', (req, res) => {
    const event = req.body;
    console.log("Received event:", event.type);

    axios.post('http://localhost:4000/events', event).catch((err) => {console.log("post:");console.log(err);});
    axios.post('http://localhost:4001/events', event).catch((err) => {console.log("comment:");console.log(err);});
    axios.post('http://localhost:4002/events', event).catch((err) => {console.log("query:");console.log(err);});
    axios.post('http://localhost:4003/events', event).catch((err) => {console.log("moderator:");console.log(err);});

    res.send({ status: "ok" });
});

app.listen(4005, () => {
    console.log("Listening on port 4005");
});