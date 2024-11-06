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
let playerStocks = [[], []];
let mines = [];

let cardsArray = [...images, ...images];

const headerImage = document.createElement("img");
headerImage.src = "media/logo_pexeso.png";
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
        if(card0.image !== "💰") {
            setTimeout(() => {
                PlaySFX('media/success.mp3', 1);
            }, 300);
        } else {
            PlaySFX('media/jackpot.mp3', 1);
            reward = 4;
        }

        const isPlayerOne = player === 0;
        const bgColor = isPlayerOne ? '#9459FF' : '#FFF658';
        
        cardsFound[player] += 1;
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

        // Check if the matched card is an active stock
        playerStocks.forEach((stocks, playerIndex) => {
            stocks.forEach(stock => {
                if (card0.image === stock.image || card1.image === stock.image || (tripleDraft && card2.image === stock.image)) {
                    ResetStock(stock);
                    alert(`Stock unsuccessful! Player ${stock.playerIndex + 1} is a poor investor. HAH!`);
                }
            });
        });

        selectedCards.forEach(cardElement => {
            cardElement.card.style.backgroundColor = bgColor;
        });
        selectedCards = [];
        UpdateCash();

        if (pairsFound === cardsArray.length / 2) {
            setTimeout(function() {
                alert("temp win text");
            }, 500);
        }

        BuyLock(false);
    } else {
        PlaySFX('media/wrong.mp3', 0.4);
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

function hasStockOnCard(card, playerIndex) {
    return playerStocks[playerIndex].some(stock => stock.card === card);
}

function PlaceStocks() {
    alert("Select a card you want to invest in. The card must stay unmatched for 6 turns.")

    UpdateCash();

    const selectStockCard = (e) => {
        const card = e.target.closest(".card");

        if (card && !card.classList.contains("flip") && !hasStockOnCard(card, player)) {
                
            playerStocks[player].push({
                card: card,
                image: card.querySelector(".card-back").textContent,
                turnsRemaining: 5, 
                playerIndex: player, 
                stockIndex: playerStocks[player].length - 1 
            });

            const stockIcon = document.createElement("div");
            stockIcon.className = "stock-icon";
            stockIcon.textContent = "💸";
            card.appendChild(stockIcon);

            playerStocks[player][playerStocks[player].length - 1].icon = stockIcon;

            container.removeEventListener("click", selectStockCard);
            stockSelect = false;
        } else if (card) {
            PlaySFX('media/stocks_denied.mp3', 1);
        }
        
    };
    container.addEventListener("click", selectStockCard);
}

function UpdateStockMoves() {
    playerStocks.forEach((stocks, playerIndex) => {
        stocks.forEach(stock => {
            if (stock.turnsRemaining > 0) {
                stock.turnsRemaining--;
            } else if (stock.turnsRemaining === 0) {
                cash[playerIndex] += 8;
                UpdateCash();
                alert(`Stock successful! Player ${playerIndex + 1} gains 8 cash.`);

                ResetStock(stock);
            }
        });
    });
}

function ResetStock(stock) {
    stock.card.removeChild(stock.icon);
    playerStocks[stock.playerIndex].splice(stock.stockIndex, 1);
}

function PlaceMine(){
    stockSelect = true;

    const followImage = document.createElement('img');
    followImage.src = 'media/mine.png';
    followImage.style.position = 'absolute';
    followImage.style.pointerEvents = 'none';
    followImage.style.width = '2.5%';
    followImage.style.height = '3%';
    document.body.appendChild(followImage);

    document.addEventListener('mousemove', function(event) {
        const imageWidth = followImage.offsetWidth;
        const imageHeight = followImage.offsetHeight;
    
        followImage.style.left = (event.pageX - imageWidth / 2) + 'px';
        followImage.style.top = (event.pageY - imageHeight / 2) + 'px';
    });

    const selectCard = (e) => {
        const card = e.target.closest(".card");

        if (card && !card.classList.contains("flip")) {
            mines.push(card);
            container.removeEventListener("click", selectCard);
            stockSelect = false;
            followImage.remove();

            PlaySFX('media/mine_ground.mp3',1);
            setTimeout(() => {
                PlaySFX('media/mine_land.mp3',1);
            }, 150);
            card.addEventListener('mouseenter', () => Explosion(card));
        } else if (card) {
            PlaySFX('media/stocks_denied.mp3', 1);
        }
    };
    container.addEventListener("click", selectCard);
}

function Explosion(card) {
    if (mines.includes(card)) {
        PlaySFX('media/mine_preexplosion.mp3');
        setTimeout(() => {
            mines = mines.filter(mine => mine !== card);
            ChangePlayer();
            PlaySFX('media/mine_explosion.mp3',1);
        }, 500);
    }
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
        else{ 
            /*PlaySFX*/
            return false;
        }
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
    if(buy(3)) {
        tripleDraft = true;
        PlaySFX('media/purchase.mp3',1);}
});
shopContainer.appendChild(sb_tripleDraft);

const sb_stocks = document.createElement("button");
sb_stocks.className = "shop-button";
sb_stocks.innerHTML = "Stocks<br>(3pts)"
sb_stocks.addEventListener("click", () => {
    if(buy(3)){ stockSelect = true;PlaceStocks();}
});
shopContainer.appendChild(sb_stocks);

const sb_landMine = document.createElement("button");
sb_landMine.className = "shop-button";
sb_landMine.innerHTML = "Land Mine<br>(4pts)"
sb_landMine.addEventListener("click", () => {
    if(buy(4)){ 
        PlaceMine();
        PlaySFX('media/mine_arm.mp3',1);
        setTimeout(() => {
            PlaySFX('media/mine_arm.mp3',1);
        }, 75);
    }
});
shopContainer.appendChild(sb_landMine);

const sb_elevatorMusic = document.createElement("button");
sb_elevatorMusic.className = "shop-button";
sb_elevatorMusic.innerHTML = "Elevator Music<br>(1pt)"
sb_elevatorMusic.addEventListener("click", () => {
    if(buy(1)){ 
        PlaySFX('media/elevator_ding.mp3',1);
        setTimeout(() => {
            PlaySFX('media/elevator_tune.mp3',1);
            setTimeout(() => {
                PlaySFX('media/elevator_noise.mp3',1);
                setTimeout(() => {
                   PlaySFX('media/elevator_voice.mp3',1);
                }, 79000);
            }, 20000);
        }, 1000);
    }
});
shopContainer.appendChild(sb_elevatorMusic);

const sb_barrage = document.createElement("button");
sb_barrage.className = "shop-button";
sb_barrage.innerHTML = "Barrage Bombardment<br>(6pts)"
sb_barrage.addEventListener("click", () => {
    if(buy(6)){ 
        PlaySFX('media/purchase.mp3',1);
    }
});
shopContainer.appendChild(sb_barrage);

//#endregion