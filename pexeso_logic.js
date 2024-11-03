const images = ["🔥", "👺", "👹", "😈", "💀", "🐍", "🤬", "🤡", "👻", "👽", "🤖", "👾", "🧟‍♀️", "🧞‍♂️", "🩻", "🍬", "🧛‍♀️", "👅", "🔪", "🖤"];
const container = document.querySelector(".game-container");
let selectedCards = [];
let player = 0;
let pairsFound = 0;
let cardsFound0 = 0;
let cardsFound1 = 0;

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
        selectedCards = [];
        setTimeout(function() {
            var success_a = new Audio('success.mp3');
            success_a.play();
        }, 300);
        
        if(player===0)cardsFound0+=1;
        else if (player===1)cardsFound1+=1;
        pairsDisplay.textContent = `Pairs Found: ${pairsFound}`;

        if (pairsFound*2 === cardsArray.length) {
            setTimeout(function() {
                alert("You did it! All cards matched!");
            }, 500);
        }
    } else {
        var wrong_a = new Audio('wrong.mp3');
        wrong_a.volume = 0.4;
        wrong_a.play();
        setTimeout(function() {
           FlipBack(card0);
            setTimeout(function() {
                FlipBack(card1);
                selectedCards = [];
            }, 50);
        }, 1000);
        ChangePlayer();
    }
}

function ChangePlayer(){
    if(player===0) player = 1;
    else player = 0;
    console.log(player);
    /*highlight*/ 
}

/*skore print*/ 
const statsContainer = document.createElement("div");
statsContainer.className = "stats-container";
container.parentNode.insertBefore(statsContainer, container.nextSibling);


const player1Text = document.createElement("h1");
player1Text.className = "player-text";
player1Text.textContent = `Player 1`;
statsContainer.appendChild(player1Text);

const pairsDisplay = document.createElement("div");
pairsDisplay.className = "pairs-display";
pairsDisplay.textContent = `Pairs Found: ${pairsFound}`;
statsContainer.appendChild(pairsDisplay);

const player2Text = document.createElement("h1");
player2Text.className = "player-text";
player2Text.textContent = `Player 2`;
statsContainer.appendChild(player2Text);
