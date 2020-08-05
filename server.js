//obj that holds the data recived from the client
projectData = {};

//nodeJS requirements added first
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
//to go through the data
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
const cors = require('cors');
const { response } = require('express');
app.use(cors());
//accessing the folder where script.js is
app.use(express.static('website'));

const serverPort = 3000;
//server startup
const server = app.listen(serverPort, serverUp);
function serverUp(){
    console.log('Server is starting.')
    console.log(`Server is now running on port: ${serverPort}`);
}
//the get req when called from the app
app.get('/all', sendData);
//data is sent to the client side
function sendData(req, res){
    res.send(projectData);
}
//post route to add data from the client to the server
app.post('/add', addData); //post route
//add data will organize the data recived and then
//assign the data to the object projectData
function addData(req, res){
    console.log(req.body);
    newEntry = {
        temp: req.body.temp,
        date: req.body.date,
        comment: req.body.comment,
    }
    projectData = newEntry;
    res.send(projectData);
    console.log(projectData);
}
