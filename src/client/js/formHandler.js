import axios from "axios";


function handleSubmit(event) {
    event.preventDefault();
    
    
    let formText = document.getElementById('URL').value;
    Klient.checkForName(formText);
    if (Klient.checkForName(formText)){
        console.log("::: Form Submitted :::"+formText);
        axios.post('/NPL', {url: formText}).then(function(res) {
            RESULTS(res.data)
        })
    } 
    else{
        alert('not valid url')
    }  
};
const RESULTS = async (RES) => {
    document.querySelector("#polarity").innerHTML = `Polarity = ${RES.score_tag}`
    document.querySelector("#agreement").innerHTML=`Agreement = ${RES.agreement}`
    document.querySelector("#subjectivity").innerHTML=`Subjectivity = ${RES.subjectivity}`
	document.querySelector("#confidence").innerHTML=`Confidence = ${RES.confidence}`
	document.querySelector("#irony").innerHTML=`Irony = ${RES.irony}`
};

export { handleSubmit }
