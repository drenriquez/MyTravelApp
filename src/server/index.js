var path = require('path');
const express = require('express');
const mockAPIResponse = require('./mockAPI.js');
const dotenv = require('dotenv');
const fetch = require('node-fetch');
dotenv.config();

const port=8081;
const app = express();
// Cors allows the browser and server to communicate without any security interruptions
const cors = require('cors');

app.use(express.static('dist'));
app.use(cors());
app.use(express.urlencoded({extended:false}));
app.use(express.json());
console.log(__dirname);
// API
const baseURL = 'https://api.meaningcloud.com/sentiment-2.1?';
const API_key = process.env.API_KEY;
console.log(`Your API Key is ${process.env.API_KEY}`);
let URLforNLP = [] ;

app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
   // res.sendFile(path.resolve('src/client/views/index.html'))
});

// designates what port the app will listen to for incoming requests
app.listen(port, function () {
    console.log(`Example app listening on port ${port}!`);
});

app.get('/test', function (req, res) {
    res.send(mockAPIResponse);
});
// POST Route
app.post('/NPL', async function(req, res) {
    console.log('***************POST 0K******************');
    let url_to_send=req.body.url;
    //console.log(url_to_send);
    let NPLurl=`${baseURL}key=${API_key}&url=${url_to_send}&lang=en`;
    const response = await fetch(NPLurl);
    const Data = await response.json();
    //console.log(Data);
    res.send(Data);
});