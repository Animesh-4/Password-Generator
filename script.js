const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '`~!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
setIndicator("#ccc");

//Set Password length
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;

    inputSlider.style.backgroundSize = ((passwordLength-min)*100/(max-min)) + "% 100%"

}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min,max) {
    return Math.floor(Math.random() * (max-min)) + min;
}

function generateRndNumber() {
    return getRndInteger(0,9);
}

function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol( ){
    const randNum = getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8){
        setIndicator("#0f0");
    }
    else if((hasUpper || hasLower) && (hasNum || hasSym) && passwordLength >= 6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "Failed";
    }
    //To make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);

}

function shufflePassword(array){
    //Fisher Yates Method
    for(let i=array.length - 1 ; i>0 ;i--){
        let j = Math.floor(Math.random()*(i+1));
        let temp = array[j];
        array[j] = array[i];
        array[i] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;

}

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    //Special Condition
    if(passwordLength < checkCount){
        passwordLength < checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change',handleCheckBoxChange);
});

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)
        copyContent();
})

generateBtn.addEventListener('click',()=>{
    //none of checkbox selected;
    if(checkCount<=0) return ;


    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    //elts start the journey to find new password
    console.log("Starting the journey");
    //remove old password
    password = "";

    //lets put the stuff mentioned in checkboxes
    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }

    // if(lowercaseCheck.checked){
    //     password += generatelowerCase();
    // }
    
    // if(numbersCheck.checked){
    //     password += generateRndNumber();
    // }
    
    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }

    let funcArray = [];

    if(uppercaseCheck.checked)
        funcArray.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArray.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArray.push(generateRndNumber);

    if(symbolsCheck.checked)
        funcArray.push(generateSymbol);

    //compulsary addition
    for(let i=0;i<funcArray.length;i++){
        password += funcArray[i]();
    }
    console.log("Compulsary addition done");


    for(let i=0 ; i < passwordLength-funcArray.length ; i++){
        let randIndex = getRndInteger(0, funcArray.length);
        password += funcArray[randIndex]();
    }
    console.log("Remaining addition done");


    //shuffle Password
    password = shufflePassword(Array.from(password));
    console.log("Shuffling Done");


    //show in UI
    passwordDisplay.value = password;
    console.log("UI Addition done");

    //calculate strength
    calcStrength();
});
