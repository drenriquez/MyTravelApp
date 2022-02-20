function checkForName(inputText) {
    console.log("::: Running checkURL :::", inputText);
    var url_test = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

    if (!url_test.test(inputText)){
        return 0;
    }
    else{
        return 1
    }
}

export { checkForName }
