const axios = require('axios');
var path = require('path');
const express = require('express');
const readXlsxFile = require('read-excel-file/node');
const mockAPIResponse = require('./mockAPI.js');
const dotenv = require('dotenv');
const fetch = require('node-fetch');
dotenv.config();
//nvm use --lts

let GEONAMES_BASEURL="http://api.geonames.org/searchJSON?q=";
let GEONAMES_CITY="";
let GEONAMES_PARAMS="&maxRows=10&fuzzy=0.8&";
let GEONAMES_USERNAME=process.env.GEONAMES_USERNAME;

let lngGEONAMES=null;
let latGEONAME=null;
let PopulationGEONAMES=null;

let listOfCity=[];
let API_KEY_WEATHERBIT=process.env.API_KEY_WEATHERBIT;

let API_KEY_PIXABAY=process.env.API_KEY_PIXABAY;

const port=8080;
const app = express();
const cors = require('cors');// Cors allows the browser and server to communicate without any security interruptions

app.use(express.static('dist'));
app.use(cors());
app.use(express.urlencoded({extended:false}));
app.use(express.json());
console.log(__dirname);
// API

///console.log(`Your API Key is ${process.env.API_KEY}`);


app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
   // res.sendFile(path.resolve('src/client/views/index.html'))
});

// designates what port the app will listen to for incoming requests
app.listen(port, function () {
    console.log(`Example app listening on port ${port}!`);
});

app.get('/test', function (req, res) {
  res.json({
    status : 200
  })
});

// POST Route
app.post('/deleteCity'  , async function(req, res) {   
  let indexElement=0;
  for (const element of listOfCity) {
    
    if(element['code']===req.body.cityCode){
      listOfCity.splice(indexElement, 1);
    }
    ++indexElement; 
  }
  res.send('***OK**CITY**DELETED***');
});
app.post('/dataForGeoname', async function(req, res) {
    console.log('***************POST 0K******************');

    let cityData={}
    //Data for APIs
    let city=req.body.city;
    let nation=req.body.nation;
    let code=req.body.code;
    let period=req.body.period;
    let DateArrive=new Date(period.substr(0, 10).trim());
    let DateDeparture= new Date(period.substr(13, 10).trim());
    let totalDaysInCity=(DateDeparture-DateArrive)/(24*3600000);
    
    //responses of APIs inizialized
    let responseGeoname='';
    let responseWeatherbit='';
    //let responseWeatherbitForManyDays='';

    //API Geoname
    GEONAMES_CITY=city;
    let getGeoname= GEONAMES_BASEURL+GEONAMES_CITY+GEONAMES_PARAMS+'username='+GEONAMES_USERNAME
    await axios.get(getGeoname).then(resp => {
       
      responseGeoname=resp.data;
      //This code select the correct city with code of Nation
      let correctCity=''
      for(let element of responseGeoname['geonames']){//provare con il metodo find
          if (element['countryCode']===code){
            correctCity=element;  
            break   
          }
      }
      if(correctCity['name']){
        city=correctCity['name']
        PopulationGEONAMES=correctCity['population'];
        lngGEONAMES=correctCity['lng'];
        latGEONAME=correctCity['lat'];
      }
      else{
        city='---';
        PopulationGEONAMES='---'
        lngGEONAMES='-135';
        latGEONAME='90';
      }
      
      })
      .catch(err => {
        res.end(JSON.stringify({err : "There was some error"}));
      })
      
      //res.send('OK****************************');
    cityData['Temperature(°c)']='';  
    // API Weatherbit
     //current
    const url =`https://api.weatherbit.io/v2.0/current?lat=${latGEONAME}&lon=${lngGEONAMES}&key=${API_KEY_WEATHERBIT}`; //`https://api.weatherbit.io/v2.0/current?lat=${latGEONAME}&lon=${lngGEONAMES}&key=${API_KEY_WEATHERBIT}`;
    await axios.get(url).then(resp => {
        responseWeatherbit=resp.data;
        // console.log(responseWeatherbit);
        // console.log(responseWeatherbit['data'][0]['temp']);
        // console.log(responseWeatherbit['data'][0]['datetime']);
        //console.log(responseWeatherbit['data'][0]['name']);
        
        if(responseWeatherbit['data'][0]['temp']){
          cityData['Temperature(°c)']=responseWeatherbit['data'][0]['temp'];
        }
        
          
        
    })
    .catch(err => {
      res.end(JSON.stringify({err : "There was some error"}));
    })
    
    //API for Pix

    const urlPIXABAY=`https://pixabay.com/api/?key=${API_KEY_PIXABAY}&q=${city}&image_type=photo`;;
   
    await axios.get(urlPIXABAY).then(resp => {
      responsePIXABAY=resp.data;
      // console.log(responsePIXABAY);
      cityData['Photo']='https://cdn.pixabay.com/photo/2020/01/27/10/24/pollution-4796858_960_720.jpg';
      if(responsePIXABAY['hits'][0]['webformatURL']){
        cityData['Photo']=responsePIXABAY['hits'][0]['webformatURL'];
      }
      
    })
    .catch(err => {
      cityData['Photo']='https://cdn.pixabay.com/photo/2020/01/27/10/24/pollution-4796858_960_720.jpg';
      res.end(JSON.stringify({err : "There was some error"}));
    })
    
    cityData['code']= city+(listOfCity.length+1);
    cityData['city']=city;
    cityData['Nation']=nation;
    cityData['Date_Arrive']=DateArrive;
    cityData['Date_Departure']=DateDeparture;
    cityData['Totl_Days_in_the_city']=totalDaysInCity;
    cityData['Population']=PopulationGEONAMES;
   
    console.log(cityData);
    listOfCity.push(cityData);
    console.log(listOfCity);
    res.send(listOfCity);
  });

//the nations and codes

let nations=[];
let nationCodes=[];

readXlsxFile('CountryCode.xlsx').then((rows) => {
    for(var i=1;i<240;i++){
        nations.push(rows[i][0]);
        nationCodes.push(rows[i][2]);
    };
    //console.log(nations)
 }
);
 //GET request
 app.get('/Nation',reqNations);
 function reqNations(req,res){
     res.send(nations);
 };

 app.get('/Code',reqCodes);
 function reqCodes(req,resp){
     resp.send(nationCodes);
 };
 module.exports = app;