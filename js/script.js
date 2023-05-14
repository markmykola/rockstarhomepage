// script for go to top button

var btnTop = document.getElementById('btn-top');

function goToTop(){
  window.scrollTo(0, 0);
}

function displayBtn(){
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    btnTop.style.display = 'block';
  }else{
    btnTop.style.display = 'none';
  }
}

window.onscroll = function(){displayBtn()};
btnTop.addEventListener("click",goToTop);

// end of script for go to top button

// function to get scroll position

function logScroll()
{
  let scroll = window.pageYOffset;
  return scroll;
}

// script for counters

//we have to do the counter animation only once. This bool is here to track that
let counterDone = false;

const counterNodeList = document.querySelectorAll("[id^=counter-]");
const numbersArray = [7, 80, 5];

function counterAnimation(counterDiv, index)
{

  // if the numbersArray and the counterNodeList don't have the same length, there will be an error. the condition below is here to prevent that
  if (numbersArray.length != counterNodeList.length)
  {
    console.log("warning : numbersArray.length & counterNodeList.length are different");
    return false;
  }

  let counter = 0;

  //Define a variable for the interval, to make sure each countdown finish their animation at roughly at the same time
  let time = 1600 / numbersArray[index];

  let i = setInterval(function()
  {
    counterDiv.innerHTML = counter;
    counter++;
    if (counter === numbersArray[index] + 1)
    {
      clearInterval(i);
    }
  }, time);

}

function execAnimation(sectionTop)
{
  let scrollPosition = logScroll();

  // check if we reached the figure section on the page & if the animation hasn't already been done
  if(scrollPosition >= sectionTop && counterDone == false)
    {
      for (let j = 0; j < numbersArray.length; j++)
      {
        counterAnimation(counterNodeList[j], j);
        //console.log(j);
      }
      counterDone = true;
    }
}

//only execute the function if the figure section exists
if(document.getElementById("figures-section"))
{
  const figureSection = document.getElementById("figures-section");
  const figureSectionTop = figureSection.getBoundingClientRect().top;

  window.addEventListener('scroll', function()
  {
    execAnimation(figureSectionTop);
  });
}

// end of script for counters

// script for the registration form

// only execute the script if the form is on the page
if(document.getElementById("register-form"))
{
  const submitBtn = document.querySelector("#submit");

  submitBtn.addEventListener("click", function(evnt)
  {
    evnt.preventDefault();
    const attendeeData = getAttendeeInfos();
    const validData = checkSubmission(attendeeData);

    if(validData)
    {
      displaySuccessMsg();
      console.log(attendeeData);
    }

  });

}

//function to get radio value
function getRadioValue(radioInput)
{
  let chosenRadio = "";
  for (let i = 0; i < radioInput.length; i++)
  {
    if(radioInput[i].checked)
    {
      chosenRadio = radioInput[i].value;
      //only one radio can be checked, so we stop the loop once we've found the checked one
      break;
    }
  }
  if(!chosenRadio)
  {
    chosenRadio = "none";
  }
  return chosenRadio;
}

//function to get text field value
function getTxtValue(txtInput)
{
  let txt = "";
  if(txtInput.value == "")
  {
    txt = "none";
  }
  else
  {
    txt = txtInput.value;
  }
  return txt;
}

//function to get checkboxes value
function getCheckBoxesValue(checkboxNodeList)
{
  let checkboxesArray = [];
  for (let i = 0; i < checkboxNodeList.length; i++)
  {
    if(checkboxNodeList[i].checked)
    {
      checkboxesArray.push(checkboxNodeList[i].value);
    }
  }

  //if nothing has been chosen
  if(checkboxesArray.length == 0)
  {
    checkboxesArray.push("none");
  }

  return checkboxesArray;

}

//function to get the user's registration datas
function getAttendeeInfos()
{

  // build the object that record every infos submitted by the attendee on registration
  const attendee = 
  {
    "first-name" : getTxtValue(document.querySelector("#first-name-input")),
    "last-name" : getTxtValue(document.querySelector("#last-name-input")),
    "title" : getTxtValue(document.querySelector("#job-title-input")),
    "email" : getTxtValue(document.querySelector("#email-input")),
    "phone" : getTxtValue(document.querySelector("#phone-input")),
    "company-name" : getTxtValue(document.querySelector("#company-input")),
    "company-address" : getTxtValue(document.querySelector("#address-input")),
    "company-city" : getTxtValue(document.querySelector("#city-input")),
    "company-state" : getTxtValue(document.querySelector("#state-input")),
    "company-zip-code" : getTxtValue(document.querySelector("#zip-code-input")),
    "workshop-choice" : getRadioValue(document.querySelectorAll(".workshop-selection")),
    "topics-choice" : getCheckBoxesValue(document.querySelectorAll(".topic-selection")),
    "other-topics" : getTxtValue(document.querySelector("#other-topics-text")),
    "allergies" : getTxtValue(document.querySelector("#allergies-input")),
    "vegan" : getRadioValue(document.querySelectorAll(".vegan")),
    "comment" : getTxtValue(document.querySelector("#comment-input"))
  }

  return attendee;

}

//function to display error message
function errorMsg(containerClass, msg, classMsg, validField)
{
  // get the class name for the error message HTML Element. We need it to handle its creation and display
  const msgSelector = "." + containerClass + "-field ." + classMsg;
  const containerField = document.querySelector("." + containerClass + "-field");

  //if the field isn't valid and if the error message isn't already displayed : we create and display the error message 
  if(!document.querySelector(msgSelector) && !validField)
  {
    //create the HTML Element for the error message
    const pElem = document.createElement("p");
    const errorTxt = document.createTextNode(msg);
    pElem.setAttribute("class","error-msg " + classMsg);
    pElem.appendChild(errorTxt);
    containerField.appendChild(pElem);
  }
  //if the field is valid and the error message is displayed : remove the error message
  else if(document.querySelector(msgSelector) && validField)
  {
    containerField.removeChild(document.querySelector(msgSelector));
  }
}

//function to check if the values respect the right format
function checkValueFormat(objProp, format)
{
  const regEx = new RegExp(format);
  return regEx.test(objProp);
}

//function to check the submission
function checkSubmission(obj)
{

  //list in the array, the object properties that stores required values
  const requiredFields = [
    "first-name",
    "last-name",
    "title",
    "email",
    "phone", 
    "company-name",
    "company-address",
    "company-city",
    "company-zip-code",
    "workshop-choice",
    "vegan"
  ];

  // check if the required fields have values
  for (let i = 0; i< requiredFields.length; i++)
  {
    if (obj[requiredFields[i]] == "none")
    {
      errorMsg(requiredFields[i], "Please fill in this field.", "required", false);
    }
    else
    {
      errorMsg(requiredFields[i], "", "required", true);
    }
  }

  // Check if values with specific format are valid. if not : write on the form the errors to check

  // check email address
  // regex taken from https://regexlib.com/REDetails.aspx?regexp_id=174
  const validMail = checkValueFormat(obj["email"], "^.+@[^\.].*\.[a-z]{2,}$");

  if(!validMail)
  {
    errorMsg("email", "Please enter a valid email: example@email.com", "format", false);
  }
  else
  {
    errorMsg("email", "", "format", true);
  }

  // check phone number
  const validPhone = checkValueFormat(obj["phone"], "[0-9]{3}-[0-9]{3}-[0-9]{4}$");

  if(!validPhone)
  {
    errorMsg("phone", "Please enter a valid phone number: 000-000-0000", "format", false);
  }
  else
  {
    errorMsg("phone", "", "format", true);
  }

  //check company zip code
  const validZipCode = checkValueFormat(obj["company-zip-code"], "^\\d{5}$");
  
  if(!validZipCode)
  {
    errorMsg("company-zip-code", "Please enter a valid ZIP Code: 00000", "format", false);
  }
  else
  {
    errorMsg("company-zip-code", "", "format", true);
  }

  //check if there's any error detected in the form
  let getErrors = document.querySelectorAll("p[class^='error-msg']");

  if(getErrors.length == 0)
  {
    return true;
  }
  else
  {
    return false;
  }

}

function displaySuccessMsg()
{
  const sucessSection = document.querySelector(".form-success");
  const formSection = document.querySelector(".form-container");
  
  formSection.style.display = "none";
  sucessSection.style.display = "block";
}

// end of script for the registration form