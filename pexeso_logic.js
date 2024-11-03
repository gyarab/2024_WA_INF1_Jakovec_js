const images = ["🔥", "👺", "👹", "😈", "💀", "🐍", "🤬", "🤡", "👻", "👽", "🤖", "👾", "🧟‍♀️", "🧞‍♂️", "🩻", "🍬", "🧛‍♀️", "👅", "🔪", "🖤"];
const container = document.querySelector(".game-container");
let selectedCards = [];
let player = 0;
let pairsFound = 0;

let cardsArray = [...images, ...images];

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
        selectedCards.forEach(cardElement => {
            cardElement.card.style.backgroundImage = "🗣️";
        });
        selectedCards = [];
        var success_a = new Audio('success.mp3');
        success_a.play();
        if (pairsFound*2 === cardsArray.length) {
            setTimeout(function() {
                alert("You did it! All cards matched!");
            }, 500);
        }
    } else {
        setTimeout(function() {
           FlipBack(card0);
            setTimeout(function() {
                FlipBack(card1);
                selectedCards = [];
            }, 50);
        }, 1000);
    }
}
