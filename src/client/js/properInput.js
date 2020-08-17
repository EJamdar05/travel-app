function checkForName(inputText) {
    if (!/^[a-zA-Z]+$/.test(inputText)){
        return false;
    }
    else{
        return true;
    }
}

export { checkForName }
