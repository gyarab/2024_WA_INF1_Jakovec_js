const images = ["🔥", "👺", "👹", "😈", "💀", "🐍", "🤬", "🤡", "👻", "👽", "🤖", "💰", "🧟‍♀️", "🧞‍♂️", "🩻", "🍬", "🧛‍♀️", "👅", "🔪", "🖤"];
const container = document.querySelector(".game-container");
let selectedCards = [];
let player = 0;
let pairsFound = 0;
let cardsFound = [0,0];
let cash = [10,1];

let buyLock = false;
let tripleDraft = false;
let stockSelect = false;
let stockCard = null;
let stockPlayers = null;
let stockMovesLeft = 0;

let cardsArray = [...images, ...images];

const headerImage = document.createElement("img");
headerImage.src = "logo_pexeso.png";
headerImage.alt = "Game Header Image";
headerImage.className = "header-image";

document.body.insertBefore(headerImage, container);

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
    if (selectedCards.length < (tripleDraft ? 3 : 2) && !card.classList.contains("flip") && !stockSelect) {
        card.classList.add("flip");
        selectedCards.push({ card: card, image: image });
        BuyLock(true);

        if (selectedCards.length === (tripleDraft ? 3 : 2)) {
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
    const card2 = tripleDraft ? selectedCards[2] : "🚫";

    if (card0.image === card1.image || (tripleDraft && card1.image === card2.image || tripleDraft && card2.image === card0.image)) {
        pairsFound += 1;
        let reward = 2;
        if(card0.image !=="💰"){
            setTimeout(function() {
                PlaySFX('success.mp3',1);
            }, 300);
        }else {PlaySFX('jackpot.mp3',1); reward = 4;}
        
        const isPlayerOne = player === 0;
        const bgColor = isPlayerOne ? '#9459FF' : '#FFF658';
        
        cardsFound[player] +=1;
        cash[player] += reward;

        /*abilitky*/ 
        if (tripleDraft) {
            let fifthWheelCardFuckingIndex;
            if (card0.image === card1.image) {
                fifthWheelCardFuckingIndex = selectedCards.indexOf(card2);
            } else if (card1.image === card2.image) {
                fifthWheelCardFuckingIndex = selectedCards.indexOf(card0);
            } else if (card0.image === card2.image) {
                fifthWheelCardFuckingIndex = selectedCards.indexOf(card1);
            }
            FlipBack(selectedCards[fifthWheelCardFuckingIndex]);
            selectedCards.splice(fifthWheelCardFuckingIndex, 1);
        }

        if(stockCard != null){
            if (card0.image === stockCard.image ||card1.image === stockCard.image||tripleDraft && card2.image === stockCard.image) {
               ResetStocks(); 
               alert(`Stock unsuccessful! Player ${stockPlayer + 1} is a poor investor. HAH!`)
            }
        }

        selectedCards.forEach(cardElement => {
            cardElement.card.style.backgroundColor = bgColor;
        });
        selectedCards = [];
        UpdateCash();

        if (pairsFound === cardsArray.length/2) {
            setTimeout(function() {
                alert("temp win text");
            }, 500);
        }

        BuyLock(false);
    } else {
        PlaySFX('wrong.mp3', 0.4);
        setTimeout(function() {
           FlipBack(card0);
            setTimeout(function() {
                FlipBack(card1);
                if (selectedCards.length > 2) FlipBack(card2);
                selectedCards = [];
            }, 50);
            ChangePlayer();
            UpdateStockMoves();
            BuyLock(false);
        }, 1000);
    }
    tripleDraft = false;
}

function ChangePlayer(){
    player1Text.classList.remove("current-player", "player1-border");
    player2Text.classList.remove("current-player", "player2-border");
    if(player===0) {player = 1; player2Text.classList.add("current-player", "player2-border")}
    else {player = 0; player1Text.classList.add("current-player", "player1-border")}
}

function PlaySFX(audio, volume){
    var success_a = new Audio(audio);
    audio.volume = volume;
    success_a.play();
}

function UpdateCash() {
    player1Cash.textContent = `Cash: ${cash[0]}`;

    player2Cash.textContent = `Cash: ${cash[1]}`;
}

function BuyLock(value){
    if (value){
        buyLock = true;
        shopContainer.querySelectorAll(".shop-button").forEach(button => {
            button.classList.add("locked");
        });
    }else{
        buyLock = false;
        shopContainer.querySelectorAll(".shop-button").forEach(button => {
            button.classList.remove("locked");
        });
    }
}

function PlaceStocks(){
    stockPlayer = player;
    stockMovesLeft = 5;
    UpdateCash();

    const selectStockCard = (e) => {
        const card = e.target.closest(".card");

        if (stockPlayer === player && stockMovesLeft === 5) {
            if (card && !card.classList.contains("flip")) {
                stockCard = card;
                stockCard.image = card.querySelector(".card-back").textContent;
                alert(`Card invested in: ${stockCard.textContent}. Must stay unmatched for 6 turns.`);

                const stockIcon = document.createElement("div");
                stockIcon.className = "stock-icon";
                stockIcon.textContent = "💸";
                card.appendChild(stockIcon);
                stockCard.icon = stockIcon;
                
                container.removeEventListener("click", selectStockCard);
                stockSelect = false;
            } else if (card && card.classList.contains("flip")) {
                PlaySFX('stocks_denied.mp3', 1);
            }
        }
    };
    container.addEventListener("click", selectStockCard);
}

function UpdateStockMoves(){
    if(stockMovesLeft > 0) stockMovesLeft--;
    else if (stockMovesLeft === 0 && stockPlayer != null) {
        cash[stockPlayer] += 8;
        console.log(stockPlayer);
        console.log(cash[stockPlayer]);
        UpdateCash();
        ResetStocks();
        alert(`Stock successful! Player ${stockPlayer + 1} gains 8 cash.`);
    }
}

function ResetStocks(){
    stockMovesLeft = 0;
    stockCard.removeChild(stockCard.icon);
    stockCard = null;
    stockPlayer = null;
}


function buy(value){
    if(!buyLock){
        if(cash[player] >= value) {
            cash[player] -= value;
            BuyLock(true);

            UpdateCash();
            
            console.log("transakce přijata");
            return true;
        }
        else return false;
    }else return false;
}

//#region skore hrac print
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
player1Score.textContent = `Points: ${cardsFound[0]}`;
player1Container.appendChild(player1Score);

const player1Cash = document.createElement("div");
player1Cash.className = "score-text";
player1Cash.textContent = `Cash: ${cash[0]}`;
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
player2Score.textContent = `Points: ${cardsFound[1]}`;
player2Container.appendChild(player2Score);

const player2Cash = document.createElement("div");
player2Cash.className = "score-text";
player2Cash.textContent = `Cash: ${cash[1]}`;
player2Container.appendChild(player2Cash);

/*init*/
player1Text.classList.add("current-player", "player1-border");
//#endregion

//#region buttony
const shopContainer = document.createElement("div");
shopContainer.className = "shop-container";
statsContainer.parentNode.insertBefore(shopContainer, statsContainer.nextSibling);

const sb_tripleDraft = document.createElement("button");
sb_tripleDraft.className = "shop-button";
sb_tripleDraft.innerHTML = "Triple Draft<br>(3pts)"
sb_tripleDraft.addEventListener("click", () => {
    if(buy(3)) tripleDraft = true;
});
shopContainer.appendChild(sb_tripleDraft);

const sb_shift = document.createElement("button");
sb_shift.className = "shop-button";
sb_shift.innerHTML = "2x Line Shift<br>(3pts)";
sb_shift.addEventListener("click", () => {
    console.log("hrac ma ted tripleDraft");
});
shopContainer.appendChild(sb_shift);

const sb_stocks = document.createElement("button");
sb_stocks.className = "shop-button";
sb_stocks.innerHTML = "Stocks<br>(3pts)"
sb_stocks.addEventListener("click", () => {
    stockSelect = true;
    if(buy(3)) PlaceStocks();
    alert("Select a card to invest in within the next move.");
});
shopContainer.appendChild(sb_stocks);

const sb_landMine = document.createElement("button");
sb_landMine.className = "shop-button";
sb_landMine.innerHTML = "Land Mine<br>(4pts)"
sb_landMine.addEventListener("click", () => {
    console.log("hrac ma ted tripleDraft");
});
shopContainer.appendChild(sb_landMine);

const sb_elevatorMusic = document.createElement("button");
sb_elevatorMusic.className = "shop-button";
sb_elevatorMusic.innerHTML = "Elevator Music<br>(1pt)"
sb_elevatorMusic.addEventListener("click", () => {
    console.log("hrac ma ted tripleDraft");
});
shopContainer.appendChild(sb_elevatorMusic);

const sb_barrage = document.createElement("button");
sb_barrage.className = "shop-button";
sb_barrage.innerHTML = "Barrage Bombardment<br>(6pts)"
sb_barrage.addEventListener("click", () => {
    console.log("hrac ma ted tripleDraft");
});
shopContainer.appendChild(sb_barrage);



//#endregion