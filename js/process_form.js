/*
//TODO
 -get values and calculate for final score
 -check if user had chosen all multiple choices
 -anon box
 -make badge
*/
//doesnt let user submit if input is invalid
//changes if submits again

function init(){
    /*------variables commonly passed around------*/
    var personInputElems = document.surveyForm.elements['person_info'];
    var personInputValid = [];//array to check if all person_info inputs are valid
    var questionArr = document.getElementsByClassName('question');
    var questionInputValid = [];//array to check if all questions have been answered
    var hints = ['Start with capital letter, only letters allowed.', 
    'Start with capital letter, spaces and aphostrophies (\') allowed.', 
    'Follow pattern xxx xxx-xxxx.', 
    'Follow pattern example@example.com',
    'Start with https://, contains a tilde (~), and a slash (/) at the end'
    ];//hints array

    /*------populate some variables------*/
    //populate user answers to false to mark that they're not answered/have not been checked
    for(var i = 0; i < questionArr.length; i++){
        var userAns = document.surveyForm.elements['question' + (i + 1)].value;
        if(userAns.length == 0){
            questionInputValid[i] = false;
        }
        else{
            questionInputValid[i] = true;
        }
    }
    for (var i = 0; i < personInputElems.length; i++){
        personInputValid[i] = false;
    }
    //disables all personal info boxes if anonymous is checked
    if(document.surveyForm.elements['anon'].checked){
        document.surveyForm.elements['person_info'].forEach(
            (elem) => {
                elem.classList.add('disable-field');
            }
        );
    }
    
    /*------Event listeners------*/
    //add click event listener on anonymous checkbox so it can update every time it's clicked 
    document.getElementById('anon').addEventListener('click', (event) => anonBox(event), false);

    //get the submit button
    document.getElementById('submit-btn').addEventListener('click', (event) => showResult(event, personInputElems), false);

    //add a focus and blur event on each person_info text box
    document.surveyForm.elements['person_info'].forEach(
        (i) => {
            i.addEventListener('focus', (event) => 
            focusHint(event, personInputElems, hints), false)
        });

    document.surveyForm.elements['person_info'].forEach(
        (i) => {
            i.addEventListener('blur', (event) => validateData(event, personInputElems, personInputValid), false)
        });

    //if user clicks on radio buttons in the survey section, it sets valid to true to mark question as answered.
    document.getElementById('survey').querySelectorAll('input').forEach(
        (i) => {
            i.addEventListener('click', (event) => setTrue(event, questionInputValid), false)
        });

    //this will check if user has already answered all questions and provided all valid inputs for personal info, then the submit button will be restored for click. 
    document.surveyForm.elements['person_info'].forEach(
        (i) => {
            i.addEventListener('blur', (event) => haveAllValidInputs(event, personInputValid, questionInputValid), false)
        });

    document.getElementById('survey').querySelectorAll('input').forEach(
        (i) => {
            i.addEventListener('click', (event) => haveAllValidInputs(event, personInputValid, questionInputValid), false)
        });
        
        document.getElementById('anon').addEventListener('click', (event) => haveAllValidInputs(event, personInputValid, questionInputValid), false);
}
window.addEventListener('load', init, false);


//function to validate person info data when text box is blurred
function validateData(event, personInputElems, personInputValid){
    //find the index of the focused element in the person_info survey section 
    var index = findIndex(personInputElems, event.target);

    //remove the hint box if it already existed so it can update when the user blur/focus
    removeElemIfExist(event.target.nextElementSibling);
    hintBox = document.createElement('div');
    hintBox.setAttribute('class', 'hint-box');

    //make icon and error message
    var icon = document.createElement('img');
    var errMsg = document.createElement('p');
    var valid = false;
    var userIput = event.target.value;

    //validate inputs
    switch (event.target.id){
        case 'fname':
            if(userIput.match(/^[A-Z][a-z]*$/gm) != null){
                valid = true;
                personInputValid[index] = true;
            }
            break;
        case 'lname':
            if(userIput.match(/^[A-Z][a-zA-Z|'|\s]*[a-zA-Z|']+$/gm) != null){
                valid = true;
                personInputValid[index] = true;
            }
            break;
        case 'phone':
            if(userIput.match(/^\d{3} \d{3}-\d{4}$/gm) != null){
                valid = true;
                personInputValid[index] = true;
            }
            break;
        case 'email':
            if(userIput.match(/^\w+@{1}[a-zA-Z]+\.\S+$/gm) != null){
                valid = true;
                personInputValid[index] = true;
            }
            break;
        case 'url':
            if(userIput.match(/^https:\/\/\S*~\S*\/$/gm) != null){
                valid = true;
                personInputValid[index] = true;
            }
            break;
    }

    //content in hint box will output, which depends on if the input was valid or not
    if (valid){
        icon.setAttribute('src', 'img/check.png');
        errMsg.appendChild(document.createTextNode('valid'));
    }
    else{
        var text = 'invalid';
        if(event.target.value.length == 0){ //different message if user did not input anything
            text = 'Please enter something!';
        }
        icon.setAttribute('src', 'img/error.png');
        errMsg.appendChild(document.createTextNode(text));
        personInputValid[index] = false;
    }

    //append the img and message in div, then append div after the input element
    hintBox.appendChild(icon);
    hintBox.appendChild(errMsg);
    event.target.after(hintBox);
}

//function to provide a hint when user focus on the text box for the person info inputs when text box is focused
function focusHint(event, personInputElems, hints){
    //find the index of the focused element in the person_info survey section 
    var index = findIndex(personInputElems, event.target);
    
    //remove the hint box if it already existed so it can update when the user blur/focus
    removeElemIfExist(event.target.nextElementSibling);
    
    //make hintbox
    hintBox = document.createElement('div');
    hintBox.setAttribute('class', 'hint-box');

    //make hint message
    var hintMsg = document.createElement('p');
    hintMsg.appendChild(document.createTextNode(hints[index]));

    hintBox.appendChild(hintMsg);
    event.target.after(hintBox);
}
//function to check if everything has been inputted and valid before showing results
function haveAllValidInputs(event, personInputValid, questionInputValid){
    var isAnon = document.surveyForm.elements['anon'].checked;

    if(!isAnon && areInputsValid(personInputValid) && areInputsValid(questionInputValid)){
        enableSubmitButton();
    }
    else if(isAnon && areInputsValid(questionInputValid)){
        enableSubmitButton();
    }
    else{
        disableSubmitButton();
    }
}

//function to show the results when user submits the form
function showResult(event, personInputElems){
    var isAnon = document.surveyForm.elements['anon'].checked;
    event.preventDefault();
    //remove result box if existed, making it update if user changes answer
    removeElemIfExist(document.getElementById('result-box'));

    //make new result box
    var resultBox = document.createElement('div');
    resultBox.setAttribute('id', 'result-box');

    //only show user info if not anonymous
    if (!isAnon){
        //store all personal info in array
        var infoText = [
            'Name: ' + personInputElems[0].value + ' ' + personInputElems[1].value, 
            'Email: ' + personInputElems[2].value,
            'Phone: ' + personInputElems[3].value,
            'Website URL: ' + personInputElems[4].value,
        ];
        var infoPar = document.createElement('p');
        //loop thru personal info array, each new info will be separated by break element for a new line
        for(var i = 0; i < infoText.length; i++){
            infoPar.appendChild(document.createTextNode(infoText[i]));
            infoPar.appendChild(document.createElement('br'));
        }
        //append the result box and its content
        resultBox.appendChild(infoPar);
    }
    var imgResult = document.createElement('img');
    imgResult.setAttribute('src', 'img/' + surveyResult() + '.jpg');
    resultBox.appendChild(imgResult);
    document.body.getElementsByTagName('main')[0].appendChild(resultBox);
}

//calculate 
function surveyResult(){
    var questionArr = document.getElementsByClassName('question');
    var actualAns = ['cat', 'dog'];
    var ansTally = [0, 0];
    for(var i = 0; i < questionArr.length; i++){
        var userAns = document.surveyForm.elements['question' + (i + 1)].value;
        if(userAns == 'cat'){
            ansTally[0]++;
        }
        else {
            ansTally[1]++;
        }
    }
    return actualAns[findHighestIndex(ansTally)];
}

//function to enable and disable anonymous mode
function anonBox(event){
    var isAnon = document.surveyForm.elements['anon'].checked;
    if(isAnon){
        //disables all personal info 
        document.surveyForm.elements['person_info'].forEach(
            (elem) => {
                elem.classList.add('disable-field');
                elem.previousElementSibling.classList.add('disable-field');
                if(elem.nextElementSibling != null){ //disable hint box if exist
                    elem.nextElementSibling.style.opacity = '0';
                }
            }
        );
    }
    else{
        //enables all personal info 
        document.surveyForm.elements['person_info'].forEach(
            (elem) => {
                elem.classList.remove('disable-field');
                elem.previousElementSibling.classList.remove('disable-field');
                if(elem.nextElementSibling != null){//enable hint box if exist
                    elem.nextElementSibling.style.opacity = '1';
                }
            }
        );
    }
}

//function to set question as answered by using the clicked element's name (parsed for number) for the questionInputValid array
function setTrue(event, questionInputValid){
    questionInputValid[event.target.name.match(/\d+$/gm)-1] = true;
}

/*-----helper functions-----*/
//function to remove a given element if it had already existed
function removeElemIfExist(elem){
    if (elem != null){
        elem.remove();
    }
}

//function to find an index of an element in an array
function findIndex(arr, elem){
    for (var i = 0; i < arr.length; i++){
        if(arr[i] == elem){
            return i;
        }
    }
}

//function to determine if every input in an input array is valid
function areInputsValid(arr){
    for (var i = 0; i < arr.length; i++){
        if(arr[i] == false){
            return false;
        }
    }
    return true;
}

//function to find the index with the highest value in an array
function findHighestIndex(arr){
    var highest = arr[0];
    var highestIndex = 0;
    for (var i = 0; i < arr.length; i++){
        if(arr[i] > highest){
            highest = arr[i];
            highestIndex = i;
        }
    }
    return highestIndex;
}

//function to enable submit button
function enableSubmitButton(){
    var submitBtn = document.getElementById('submit-btn');
    submitBtn.style.pointerEvents = 'auto';
    submitBtn.style.opacity = 'initial';
}

//function to disable submit button
function disableSubmitButton(){
    var submitBtn = document.getElementById('submit-btn');
    submitBtn.style.pointerEvents = 'none';
    submitBtn.style.opacity = '0.2';
}