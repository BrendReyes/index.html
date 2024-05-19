/*List of features needed:
  ❌ random math problems contents of cards
  ❌ difficulty scaling
  ❌ score reveal at the end of the game
  ✅ timer (with increment and decrement) 
  ✅ match and mismatch tracker
*/
const cards = document.querySelectorAll(".card"),
timeTag = document.querySelector("#time b"),
flipsTag = document.querySelector(".flips b"),
refreshBtn = document.querySelector(".details button"),
matchTag = document.querySelector(".matches b"),
mismatchTag = document.querySelector(".mismatches b");

let maxTime = 300;
let timeLeft = maxTime;
let flips = 0;
let matchedCard = 0;
let disableDeck = false;
let isPlaying = false;
let cardOne, cardTwo, timer;
let matches = 0;
let mismatches = 0;

//for win pop up alert
const openBtn = document.getElementById("openModal"); 
const closeBtn = document.getElementById("closeModal");
const modal = document.getElementById("modal");

//for lose pop up alert
const openBtn2 = document.getElementById("openModal2");
const closeBtn2 = document.getElementById("closeModal2");
const modal2 = document.getElementById("modal2");

//for pause modal
const openBtnPause = document.getElementById("openModalPause");
const closeBtnPause = document.getElementById("closeModalPause");
const modalPause = document.getElementById("modalPause");

function initTimer() {//timer countdown

  if(timeLeft <= 0) {
    setTimeout(() => {//delay before showing the pop up lose alert
        document.querySelector('.matchesModal2 b').innerHTML = matches;
        document.querySelector('.mismatchesModal2 b').innerHTML = mismatches;
        document.querySelector('.flipsModal2 b').innerHTML = flips;
        openBtn2.removeEventListener("click", openModal2);
        modal2.classList.add("open");
        closeBtn2.addEventListener("click", () => {
        modal2.classList.remove("open");
        shuffleCard();
      });
      }, 50);
      return clearInterval(timer);
  }
  timeLeft--; //time decrement
  timeTag.innerText = timeLeft; //getting the text from html
}

function flipCard({target: clickedCard}) {
  if(!isPlaying) {
      isPlaying = true;
      timer = setInterval(initTimer, 1000);
  }
  if(clickedCard !== cardOne && !disableDeck && timeLeft > 0) {
      flips++;
      flipsTag.innerText = flips;
      clickedCard.classList.add("flip");
      if(!cardOne) {
          //return the cardOne value to ClickedCard
          return cardOne = clickedCard;
      }
      cardTwo = clickedCard;
      disableDeck = true;
      let cardOneNum = cardOne.querySelector(".back-view h1").innerText,
      cardTwoNum = cardTwo.querySelector(".back-view h1").innerText;
      let EvalCard = eval(cardOneNum);
      let EvalCard2 = eval(cardTwoNum);
      if(Number.isInteger(EvalCard)){ //check if it is an integer 
        EvalCard = Math.trunc(EvalCard); //remove the decimal (.00) if has not decimal value
      }
      else{
        EvalCard = EvalCard.toFixed(2); //if has decimal value, take the second decimal
      }
      if(Number.isInteger(EvalCard2)){ //check if it is an integer 
        EvalCard2 = Math.trunc(EvalCard2); //remove the decimal (.00) if has not decimal value
      }
      else{
        EvalCard2 = EvalCard2.toFixed(2); //if has decimal value, take the second decimal
      }
      //matchCards(cardOneNum, cardTwoNum); //function to check if the cards are the same
      console.log("EVAL CARD: " + EvalCard + " " + EvalCard2);
      matchCards(EvalCard, EvalCard2);
  }
}

function matchCards(num1, num2) {
  if(num1 === num2) { //if the 2 cards matched
      matchedCard++; //incremet match value by 1
      
      matches++; //counts the matches
      matchTag.innerText = matches;

      setTimeout(() => {
        timeLeft += 3; // plus 3s every match
        timeTag.innerText = timeLeft;
      }, 500);
      
      if(matchedCard == 21 && timeLeft > 0) {//if the user has matched all the cards 
        document.querySelector('.matchesModal b').innerHTML = matches;
        document.querySelector('.mismatchesModal b').innerHTML = mismatches;
        document.querySelector('.flipsModal b').innerHTML = flips;
        setTimeout(() => {//pop up alert 
        openBtn.removeEventListener("click", openModal);
        modal.classList.add("open");
        closeBtn.addEventListener("click", () => {
          modal.classList.remove("open");
          shuffleCard();
        });
      }, 250);

        return clearInterval(timer);    
      }
  
      cardOne.removeEventListener("click", flipCard);
      cardTwo.removeEventListener("click", flipCard);
      cardOne = cardTwo = ""; //setting both card value to blank
      return disableDeck = false;
  }
    //if the two cards did not match
  setTimeout(() => {
      //there will be shake effect 
      cardOne.classList.add("shake");
      cardTwo.classList.add("shake");

      mismatches++; //counts the mismatch
      mismatchTag.innerText = mismatches;

      setTimeout(() => {
        timeLeft -= 2; // minus 2s every mismatch
        timeTag.innerText = timeLeft;
        if(timeLeft < 0){
          timeLeft = 0;
          timeTag.innerText = timeLeft;         
        }
      }, 200);
  }, 400);

  setTimeout(() => {
      //removing shake and flip classes from both cards
      cardOne.classList.remove("shake", "flip");
      cardTwo.classList.remove("shake", "flip");
      cardOne = cardTwo = ""; //setting both card value to blank
      disableDeck = false;
  }, 1200);
}

function shuffleCard() {
  timeLeft = maxTime;
  flips = matchedCard = 0;
  cardOne = cardTwo = "";
  clearInterval(timer);
  timeTag.innerText = timeLeft;
  flipsTag.innerText = flips;
  matches = 0;
  mismatches = 0;
  matchTag.innerText = matches;
  mismatchTag.innerText = mismatches;
  disableDeck = isPlaying = false;

  var arrProblems = [], results = [], RanNum1 = 0, RanNum2 = 0, Operation, Oper = "";
  for(var i = 0; i < 21; i++){ //this is were randomly generating numbers for math calculation
  RanNum1 = Math.floor(Math.random() * 10) + 1; //for num1 (e.g 5)
  RanNum2 = Math.floor(Math.random() * 10) + 1; //for num2 (e.g 10)
  Operation = Math.floor(Math.random() * 4); // for operation (e.g 2) then it will become (5 * 10)
    switch (Operation){ //choosing what operation 
      case 0: 
      Oper = "+";
      break;
      case 1:
      Oper = "-";
      break;
      case 2: 
      Oper = "*";
      break;
      case 3:
      Oper = "/"
      break;
    }  
    arrProblems.push(RanNum1 + "" + Oper + "" + RanNum2); //storing it to array
  }

  for (var i = 0; i < arrProblems.length; i++) { //for evaluating 
    let result = eval(arrProblems[i]); //evaluating each elements in array
    if(Number.isInteger(result)){ //check if it is an integer 
      result = Math.trunc(result); //remove the decimal (.00) if has not decimal value
    }
    else{
      result = result.toFixed(2); //if has decimal value, take the second decimal
    }
    results.push(result); //storing it into new array which are the evaluated values
  }
  for(var i = 0; i < results.length; i++){
    arrProblems.push(results[i]); //storing the values into the main array therefore the array for
                                  //the display on cards is now complete
  }
  console.log(arrProblems);

  arrProblems.sort(() => Math.random() > 0.5 ? 1 : -1); //sorting array randomly
  cards.forEach((card, index) => {
      card.classList.remove("flip");
      let numTag = card.querySelector(".back-view h1");
      setTimeout(() => {
          numTag.innerText = arrProblems[index]; //content of the card that comes from the array
      }, 500);
      card.addEventListener("click", flipCard);
  });
}//end of shuffle function

shuffleCard();

refreshBtn.addEventListener("click", shuffleCard);

cards.forEach(card => { //adding click events to all cards
  card.addEventListener("click", flipCard);
});


const box = document.querySelector("#flame_box");//for flame animation
const flames = document.querySelectorAll('.flame');
function addFlame() { //removing the flame when it reaches zero
  if (timeLeft == 0) {
    setTimeout(() => {  
    
  }, 200); 
    flames.forEach(flame => flame.remove());
    return;
    
}

	var f = document.createElement("div");
	f.className = "flame";
	f.style.left = Math.random() * 100 + "%";
	f.style.animationDuration = Math.random() < 0.5 ? "3s" : "1.5s";
	f.onanimationend = function () {
		this.remove();
	};
	box.appendChild(f);
}
setInterval(addFlame, 0); 

  window.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
      pauseTimer();
      openBtnPause.removeEventListener("keypress", openModal);
      modalPause.classList.add("open");
      closeBtnPause.addEventListener("click", () => {
      modalPause.classList.remove("open");
      startTimer();
      
      });
    }
  });

  function restart(){
    shuffleCard();
      modalPause.classList.remove("open");
  }

  function startTimer() { //FOR RESUMING THE GAME
    clearInterval(timer); 
    timer = setInterval(initTimer, 1000); 
  }
  
  function pauseTimer() { //FOR PAUSING THE GAME
    clearInterval(timer); 
  }

