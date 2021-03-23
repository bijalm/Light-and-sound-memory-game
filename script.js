//global constants
const clueHoldTime = 1000; //how long to hold each clue's light/sound
const cluePauseTime = 200; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

//Global Variables
var pattern = [];
var progress = 0; 
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;  //must be between 0.0 and 1.0
var guessCounter = 0;

function startGame(){
    //initialize game variables
    progress = 0;
    gamePlaying = true;
    randomPattern(pattern);
    // swap the Start and Stop buttons
    document.getElementById("startBtn").classList.add("hidden");
    document.getElementById("stopBtn").classList.remove("hidden");
  
    playClueSequence();
}

function stopGame(){
    gamePlaying = false;
    
    // swap the Start and Stop buttons
    document.getElementById("stopBtn").classList.add("hidden");
    document.getElementById("startBtn").classList.remove("hidden");
}

//Random pattern created each time game starts
function randomPattern(ptn){
    for(var i = 0; i < 8; i++){
      ptn[i] = Math.floor(Math.random() * 6) + 1;
    }
}

// Sound Synthesis Functions
const freqMap = {
  1: 500,
  2: 420,
  3: 450,
  4: 550,
  5: 600,
  6: 380
}

function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    tonePlaying = true
  }
}
function stopTone(){
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
    tonePlaying = false
}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)

//Audio
function playAudio(id,len){
    playMyAudio(id);
    setTimeout(function(){
      pauseMyAudio(id)
    },len)
}

function playMyAudio(id){
    if(id == 1 ){
        document.getElementById("goodPlaceaud").play();
    } else if(id == 2){
        document.getElementById("b99aud").play();
    } else if(id == 3){
        document.getElementById("wanvisaud").play();
    } else if(id == 4){
        document.getElementById("newgirlaud").play();
    } else if(id == 5){
        document.getElementById("paraud").play();
    } else if(id == 6){
        document.getElementById("friendsaud").play();
    }
    
}

function pauseMyAudio(id){
    if(id == 1 ){
        document.getElementById("goodPlaceaud").pause();
    } else if(id == 2){
        document.getElementById("b99aud").pause();
    } else if(id == 3){
        document.getElementById("wanvisaud").pause();
    } else if(id == 4){
        document.getElementById("newgirlaud").pause();
    } else if(id == 5){
        document.getElementById("paraud").pause();
    } else if(id == 6){
        document.getElementById("friendsaud").pause();
    }
}

function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}
function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}

function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playAudio(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime, btn);
    //pauseMyAudio(btn);
    //playTone(btn,clueHoldTime);
    //setTimeout(clearButton,clueHoldTime,btn);
  }
}

function playClueSequence(){
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
}

function loseGame(){
  stopGame();
  alert("Game Over. You lost.");
}

function winGame(){
  stopGame();
  alert("Game Over. You won!");
}

function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }

  // add game logic here
  if(pattern[guessCounter] == btn){
      if(guessCounter == progress){
         if(progress == pattern.length - 1){
             winGame();
         } else{
             progress++;
             playClueSequence();
         }
      } else{
        guessCounter++;
      }
        
  } else {
      loseGame();
  }
}