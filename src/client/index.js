import axios from "axios";
// sass files
import './styles/resets.scss'
import './styles/base.scss'
import './styles/footer.scss'
import './styles/form.scss'
import './styles/header.scss'

let nations = [];
let codes = [];
let nationSelected='';
let codeNationSelested='';

let main= document.querySelector('#Main');
//  ASYNC GET
const getCodeOrNation = async (url = '') => {
    const request = await fetch(url);
    try {
        const allData = await request.json();
        return allData;
    } catch (error) {
        console.log("error", error);
    }

};
async function NationsAndCodes() {
    getCodeOrNation('/Nation').then(function (allData) {
        nations = allData;
        console.log(nations)
    });
    getCodeOrNation('/Code').then(function (allData) {
        codes = allData;
        console.log(codes)
    });

};
NationsAndCodes();

function construct() {
    const fragment = document.createDocumentFragment();
    for (var i = 0; i < 239; i++) {
        const newElement = document.createElement('option');
        newElement.setAttribute('value', codes[i]);
        newElement.textContent = nations[i];
        fragment.appendChild(newElement);
    };
    document.querySelector("#Nazioni").appendChild(fragment);
};
setTimeout(() => { construct(); value = e.options[e.selectedIndex].value; }, 800);

let e = document.getElementById("Nazioni");
let cod = document.getElementById("cod");
e.addEventListener('change', () => {
    let value = e.options[e.selectedIndex].value.substr(0,2)  ;
    cod.textContent =value;
    console.log(value);
    codeNationSelested=value;
    console.log( e.options[e.selectedIndex].textContent);
    nationSelected=e.options[e.selectedIndex].textContent;

});

let submit=document.getElementById("submt");
submit.addEventListener("click",()=>{
    let spin=document.querySelector('#spin');
    spin.classList.remove('displayNon')
    let period=document.querySelector('#range').value;
    console.log(period)
    let city=document.getElementById("Inputcity").value;
    console.log(city);
    //send code and nation to server
    axios.post('/dataForGeoname', {city: city,nation:nationSelected, code:codeNationSelested,period:period}).then(function(res) {
        console.log(res.data);
        let divToRemove=document.querySelector('.city')
        if(divToRemove){
            document.querySelectorAll('.city').forEach(e => e.remove());
        }
        return res
    }).then(function(res){
        for(let cit in res.data){
            createCityTab(res.data,cit);
        }

    }).then(()=>{spin.classList.add('displayNon')});
});
let createCityTab = async function (data,index){
    let main= document.querySelector('#Main')
    let divCity = document.createElement("div");
    divCity.style.display='block'
    divCity.classList.add("city");
    divCity.classList.add("boxFlex");
    divCity.innerHTML=`<h1>${data[index]['city']}, ${data[index]['Nation']}, Population ${data[index]['Population']}</h1><button value="${data[index]['code']}" class="btn btn-secondary btnCancel">X</button><br>
                        <h1>Arrive: ${data[index]['Date_Arrive'].substr(0,10)}, Departure: ${data[index]['Date_Departure'].substr(0,10)}</h1><br>
                        <h1>Total days in the City ${data[index]['Totl_Days_in_the_city']}</h1><br>
                        <h1>Temperature (°C) ${data[index]['Temperature(°c)']}</h1><br>
                        <img class='imgCity' src="${data[index]['Photo']}" alt="">`





    
    main.appendChild(divCity);
    // let data_city=document.createElement("h3");
    // data_city.textContent=data[index]['city'];
    // divCity.appendChild(data_city);
}