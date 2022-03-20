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
    let period=document.querySelector('#range').value;
    console.log(period)
    let city=document.getElementById("Inputcity").value;
    console.log(city);
    //send code and nation to server
    axios.post('/dataForGeoname', {city: city,nation:nationSelected, code:codeNationSelested,period:period}).then(function(res) {
        console.log(res.data)
    })
});
