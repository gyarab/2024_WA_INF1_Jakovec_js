const images = ["🔥", "👺", "👹", "😈", "💀", "🐍", "🤬", "🤡", "👻", "👽", "🤖", "💰", "🧟‍♀️", "🧞‍♂️", "🩻", "🍬", "🧛‍♀️", "👅", "🔪", "🖤"];
const container = document.querySelector(".game-container");
let selectedCards = [];
let player = 0;
let pairsFound = 0;
let cardsFound0 = 0;
let cardsFound1 = 0;
let cash0 = 0;
let cash1 = 0;

let cardsArray = [...images, ...images];

/*generace*/ 
for (let i = cardsArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    let temp = cardsArray[i];
    cardsArray[i] = cardsArray[j];
    cardsArray[j] = temp;
}

for (let i = 0; i < cardsArray.length; i++) {
    let cardElement = Instantiate(cardsArray[i]);
    container.appendChild(cardElement);
}

function Instantiate(image) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
        <div class="card-back">${image}</div>
    `;
    card.addEventListener("click", function() {
        Flip(card, image);
    });
    return card;
}

function Flip(card, image) {
    if (selectedCards.length < 2 && !card.classList.contains("flip")) {
        card.classList.add("flip");
        selectedCards.push({ card: card, image: image });

        if (selectedCards.length === 2) {
            Check();
        }
    }
}

function FlipBack(card_){
    card_.card.classList.add("flip-back");
    setTimeout(() => {
        card_.card.classList.remove("flip", "flip-back");
    }, 75);
}

function Check() {
    const card0 = selectedCards[0];
    const card1 = selectedCards[1];

    if (card0.image === card1.image) {
        pairsFound += 1;
        let reward = 2;
        if(card0.image !=="💰"){
            setTimeout(function() {
                PlaySFX('success.mp3',1);
            }, 300);
        }else {PlaySFX('jackpot.mp3',1); reward = 4;}
        
        if(player===0){
            cardsFound0+=1; 
            cash0 += reward; 
            player1Score.textContent = `Score: ${cardsFound0}`;
            player1Cash.textContent = `Cash: ${cash0}`;
            selectedCards.forEach(cardElement => {
                cardElement.card.style.backgroundColor = '#9459FF';
            });
        }else if (player===1){
            cardsFound1+=1; 
            cash1 += reward; 
            player2Score.textContent = `Score: ${cardsFound1}`;
            player2Cash.textContent = `Cash: ${cash1}`;
            selectedCards.forEach(cardElement => {
                cardElement.card.style.backgroundColor = '#FFF658';
            });
        }
        selectedCards = [];

        if (pairsFound === cardsArray.length/2) {
            setTimeout(function() {
                alert("temp win text");
            }, 500);
        }
    } else {
        PlaySFX('wrong.mp3', 0.4);
        setTimeout(function() {
           FlipBack(card0);
            setTimeout(function() {
                FlipBack(card1);
                selectedCards = [];
            }, 50);
            ChangePlayer();
        }, 1000);
    }
}

function ChangePlayer(){
    player1Text.classList.remove("current-player", "player1-border");
    player2Text.classList.remove("current-player", "player2-border");
    if(player===0) {player = 1; player2Text.classList.add("current-player", "player2-border")}
    else {player = 0; player1Text.classList.add("current-player", "player1-border")}
    console.log(player);
}

function PlaySFX(audio, volume){
    var success_a = new Audio(audio);
    audio.volume = volume;
    success_a.play();
}


/*********skore print**********/ 
const statsContainer = document.createElement("div");
statsContainer.className = "stats-container";
container.parentNode.insertBefore(statsContainer, container.nextSibling);

/*hrac 1*/
const player1Container = document.createElement("div");
player1Container.className = "player-container";
statsContainer.appendChild(player1Container);

const player1Text = document.createElement("h1");
player1Text.className = "player-text";
player1Text.textContent = `Player 1`;
player1Container.appendChild(player1Text);

const player1Score = document.createElement("div");
player1Score.className = "score-text";
player1Score.textContent = `Points: ${cardsFound0}`;
player1Container.appendChild(player1Score);

const player1Cash = document.createElement("div");
player1Cash.className = "score-text";
player1Cash.textContent = `Cash: ${cash0}`;
player1Container.appendChild(player1Cash);


/*hrac2*/
const player2Container = document.createElement("div");
player2Container.className = "player-container";
statsContainer.appendChild(player2Container);

const player2Text = document.createElement("h1");
player2Text.className = "player-text";
player2Text.textContent = `Player 2`;
player2Container.appendChild(player2Text);

const player2Score = document.createElement("div");
player2Score.className = "score-text";
player2Score.textContent = `Points: ${cardsFound1}`;
player2Container.appendChild(player2Score);

const player2Cash = document.createElement("div");
player2Cash.className = "score-text";
player2Cash.textContent = `Cash: ${cash1}`;
player2Container.appendChild(player2Cash);

/*init*/
player1Text.classList.add("current-player", "player1-border");