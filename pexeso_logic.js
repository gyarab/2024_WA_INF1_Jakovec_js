const cardImages = ["🍎", "🍌", "🍇", "🍒", "🍓", "🍍", "🍉", "🍑"]; // Card pairs
const gameContainer = document.querySelector(".game-container");
let flippedCards = [];
let matchedCards = 0;

// Duplicate and shuffle cards
let cards = [...cardImages, ...cardImages]
    .sort(() => 0.5 - Math.random())
    .map((img) => createCardElement(img));

// Add cards to the game container
cards.forEach((card) => gameContainer.appendChild(card));

// Function to create each card element
function createCardElement(img) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
        <div class="card-inner">
            <div class="card-front"></div>
            <div class="card-back">${img}</div>
        </div>
    `;
    card.addEventListener("click", () => flipCard(card, img));
    return card;
}

// Function to handle card flipping
function flipCard(card, img) {
    if (flippedCards.length < 2 && !card.classList.contains("flip")) {
        card.classList.add("flip");
        flippedCards.push({ card, img });

        if (flippedCards.length === 2) {
            checkForMatch();
        }
    }
}

// Function to check for a match
function checkForMatch() {
    const [card1, card2] = flippedCards;
    if (card1.img === card2.img) {
        matchedCards += 2;
        flippedCards = [];
        if (matchedCards === cards.length) {
            setTimeout(() => alert("Congratulations! You matched all cards!"), 500);
        }
    } else {
        setTimeout(() => {
            card1.card.classList.remove("flip");
            card2.card.classList.remove("flip");
            flippedCards = [];
        }, 1000);
    }
}