// Game state
let gameState = {
    currentScreen: 'main-menu',
    gameMode: null,
    playerElo: 1000,
    gameStats: {
        gamesPlayed: 0,
        gamesWon: 0,
        bestHand: 0
    },
    currentGame: null,
    queueTimer: null,
    queueStartTime: null
};

// AI usernames
const regularAI = [
    'Alex', 'Sam', 'Jordan', 'Casey', 'Morgan', 'Taylor', 'Riley', 'Quinn',
    'Avery', 'Blake', 'Cameron', 'Drew', 'Emery', 'Finley', 'Gray', 'Harper',
    'Indigo', 'Jules', 'Kai', 'Lane', 'Mickey', 'Nova', 'Ocean', 'Parker'
];

const highRankedAI = [
    'Shadow', 'Viper', 'Phoenix', 'Raven', 'Wolf', 'Eagle', 'Tiger', 'Dragon',
    'Frost', 'Blaze', 'Thunder', 'Storm', 'Night', 'Dawn', 'Zen', 'Nova',
    'Vortex', 'Pulse', 'Echo', 'Rift', 'Cipher', 'Matrix', 'Quantum', 'Nexus'
];

// Card deck
class Card {
    constructor(suit, value) {
        this.suit = suit;
        this.value = value;
        this.isRed = suit === '♥' || suit === '♦';
    }

    get displayValue() {
        if (this.value === 1) return 'A';
        if (this.value === 11) return 'J';
        if (this.value === 12) return 'Q';
        if (this.value === 13) return 'K';
        return this.value.toString();
    }

    get blackjackValue() {
        if (this.value === 1) return 11; // Ace
        if (this.value >= 10) return 10; // Face cards
        return this.value;
    }
}

class Deck {
    constructor() {
        this.cards = [];
        this.reset();
    }

    reset() {
        this.cards = [];
        const suits = ['♠', '♥', '♦', '♣'];
        for (let suit of suits) {
            for (let value = 1; value <= 13; value++) {
                this.cards.push(new Card(suit, value));
            }
        }
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    draw() {
        return this.cards.pop();
    }
}

class Player {
    constructor(name, isAI = false) {
        this.name = name;
        this.isAI = isAI;
        this.hand = [];
        this.score = 0;
        this.busted = false;
        this.stand = false;
        this.roundsWon = 0;
    }

    addCard(card) {
        this.hand.push(card);
        this.calculateScore();
    }

    calculateScore() {
        let score = 0;
        let aces = 0;

        // First pass: add non-ace cards
        for (let card of this.hand) {
            if (card.value === 1) {
                aces++;
            } else {
                score += card.blackjackValue;
            }
        }

        // Second pass: add aces
        for (let i = 0; i < aces; i++) {
            if (score + 11 <= 21) {
                score += 11;
            } else {
                score += 1;
            }
        }

        this.score = score;
        this.busted = score > 21;
    }

    clearHand() {
        this.hand = [];
        this.score = 0;
        this.busted = false;
        this.stand = false;
    }

    shouldHit() {
        if (this.isAI) {
            // Simple AI logic: hit on 16 or below, stand on 17+
            return this.score <= 16;
        }
        return false;
    }
}

class Game {
    constructor(mode) {
        this.mode = mode;
        this.deck = new Deck();
        this.deck.shuffle();
        this.dealer = new Player('Dealer', true);
        this.players = [];
        this.currentRound = 1;
        this.maxRounds = mode === 'ffa' ? 10 : 5;
        this.roundResults = [];
        this.gameOver = false;
        
        this.initializePlayers();
    }

    initializePlayers() {
        // Add human player
        this.players.push(new Player('Player', false));
        
        // Add AI players based on mode
        if (this.mode === '1v1') {
            this.players.push(new Player(this.getAIName(), true));
        } else if (this.mode === '2v2') {
            this.players.push(new Player(this.getAIName(), true));
            this.players.push(new Player(this.getAIName(), true));
            this.players.push(new Player(this.getAIName(), true));
        } else if (this.mode === 'ffa') {
            // Add 3-4 more AI players for FFA
            const aiCount = Math.floor(Math.random() * 3) + 2; // 2-4 AI players
            for (let i = 0; i < aiCount; i++) {
                this.players.push(new Player(this.getAIName(), true));
            }
        }
    }

    getAIName() {
        const isHighRanked = Math.random() < 0.3; // 30% chance for high ranked
        const nameList = isHighRanked ? highRankedAI : regularAI;
        return nameList[Math.floor(Math.random() * nameList.length)];
    }

    startRound() {
        this.deck.reset();
        this.deck.shuffle();
        
        // Clear all hands
        this.dealer.clearHand();
        for (let player of this.players) {
            player.clearHand();
        }

        // Deal initial cards
        for (let i = 0; i < 2; i++) {
            for (let player of this.players) {
                player.addCard(this.deck.draw());
            }
            this.dealer.addCard(this.deck.draw());
        }

        // Hide dealer's second card initially
        this.dealer.hand[1].hidden = true;
    }

    playAITurn() {
        for (let player of this.players) {
            if (player.isAI && !player.busted && !player.stand) {
                while (player.shouldHit() && !player.busted) {
                    player.addCard(this.deck.draw());
                }
                player.stand = true;
            }
        }
    }

    playDealerTurn() {
        this.dealer.hand[1].hidden = false; // Reveal hidden card
        this.dealer.calculateScore();
        
        while (this.dealer.score < 17) {
            this.dealer.addCard(this.deck.draw());
        }
    }

    determineRoundWinner() {
        const results = [];
        
        for (let player of this.players) {
            let result = 'lose';
            
            if (player.busted) {
                result = 'bust';
            } else if (this.dealer.busted) {
                result = 'win';
            } else if (player.score > this.dealer.score) {
                result = 'win';
            } else if (player.score < this.dealer.score) {
                result = 'lose';
            } else {
                result = 'push';
            }
            
            if (result === 'win') {
                player.roundsWon++;
            }
            
            results.push({
                player: player.name,
                result: result,
                score: player.score,
                busted: player.busted
            });
        }
        
        this.roundResults.push(results);
        return results;
    }

    isGameOver() {
        return this.currentRound >= this.maxRounds;
    }

    nextRound() {
        if (this.currentRound < this.maxRounds) {
            this.currentRound++;
            this.startRound();
            return true;
        }
        return false;
    }

    getFinalResults() {
        const sortedPlayers = [...this.players].sort((a, b) => b.roundsWon - a.roundsWon);
        return sortedPlayers.map((player, index) => ({
            name: player.name,
            roundsWon: player.roundsWon,
            position: index + 1
        }));
    }
}

// Screen management
function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show target screen
    document.getElementById(screenId).classList.add('active');
    gameState.currentScreen = screenId;
}

function showMainMenu() {
    showScreen('main-menu');
    if (gameState.currentGame) {
        gameState.currentGame = null;
    }
}

function showGameMode(mode) {
    if (mode === 'casual') {
        showScreen('game-mode');
    }
}

function showComingSoon(feature) {
    document.getElementById('coming-soon-title').textContent = `${feature} Coming Soon`;
    document.getElementById('coming-soon-text').textContent = `The ${feature} feature is currently under development and will be available soon!`;
    document.getElementById('coming-soon-modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('coming-soon-modal').style.display = 'none';
}

function showTutorial() {
    showScreen('tutorial-screen');
}

function showSettings() {
    showScreen('settings-screen');
}

function showStats() {
    updateStatsDisplay();
    showScreen('stats-screen');
}

function updateStatsDisplay() {
    document.getElementById('current-elo').textContent = gameState.playerElo;
    document.getElementById('games-played').textContent = gameState.gameStats.gamesPlayed;
    document.getElementById('games-won').textContent = gameState.gameStats.gamesWon;
    
    const winRate = gameState.gameStats.gamesPlayed > 0 
        ? Math.round((gameState.gameStats.gamesWon / gameState.gameStats.gamesPlayed) * 100)
        : 0;
    document.getElementById('win-rate').textContent = `${winRate}%`;
    
    document.getElementById('best-hand').textContent = gameState.gameStats.bestHand;
}

// Game mode selection
function selectGameMode(mode) {
    gameState.gameMode = mode;
    startQueue();
}

// Queue system
function startQueue() {
    showScreen('queue-screen');
    gameState.queueStartTime = Date.now();
    
    // Calculate queue time based on ELO (3-20 seconds)
    const baseTime = 3000; // 3 seconds
    const eloFactor = Math.min(gameState.playerElo / 1000, 1); // Normalize ELO
    const maxAdditionalTime = 17000; // 17 additional seconds
    const queueTime = baseTime + (eloFactor * maxAdditionalTime);
    
    gameState.queueTimer = setTimeout(() => {
        startGame();
    }, queueTime);
    
    // Update queue timer display
    updateQueueTimer();
}

function updateQueueTimer() {
    if (gameState.queueStartTime && gameState.currentScreen === 'queue-screen') {
        const elapsed = Math.floor((Date.now() - gameState.queueStartTime) / 1000);
        document.getElementById('queue-time').textContent = `${elapsed}s`;
        
        if (gameState.queueTimer) {
            requestAnimationFrame(updateQueueTimer);
        }
    }
}

function cancelQueue() {
    if (gameState.queueTimer) {
        clearTimeout(gameState.queueTimer);
        gameState.queueTimer = null;
    }
    showMainMenu();
}

// Game management
function startGame() {
    gameState.currentGame = new Game(gameState.gameMode);
    showScreen('game-screen');
    updateGameDisplay();
    gameState.currentGame.startRound();
    updateGameDisplay();
}

function updateGameDisplay() {
    if (!gameState.currentGame) return;
    
    const game = gameState.currentGame;
    
    // Update game info
    document.getElementById('game-mode-display').textContent = `Mode: ${game.mode.toUpperCase()}`;
    document.getElementById('round-info').textContent = `Round ${game.currentRound}/${game.maxRounds}`;
    document.getElementById('player-elo').textContent = gameState.playerElo;
    
    // Update dealer area
    updateDealerDisplay();
    
    // Update player area
    updatePlayerDisplay();
    
    // Update opponents
    updateOpponentsDisplay();
}

function updateDealerDisplay() {
    const dealer = gameState.currentGame.dealer;
    const dealerCards = document.getElementById('dealer-cards');
    const dealerScore = document.getElementById('dealer-score');
    
    dealerCards.innerHTML = '';
    for (let i = 0; i < dealer.hand.length; i++) {
        const card = dealer.hand[i];
        const cardElement = createCardElement(card, i === 1 && dealer.hand[1].hidden);
        dealerCards.appendChild(cardElement);
    }
    
    // Show score only if not hidden
    if (dealer.hand[1] && !dealer.hand[1].hidden) {
        dealerScore.textContent = dealer.score;
    } else {
        dealerScore.textContent = '?';
    }
}

function updatePlayerDisplay() {
    const player = gameState.currentGame.players[0]; // Human player is always first
    const playerCards = document.getElementById('player-cards');
    const playerScore = document.getElementById('player-score');
    
    playerCards.innerHTML = '';
    for (let card of player.hand) {
        const cardElement = createCardElement(card, false);
        playerCards.appendChild(cardElement);
    }
    
    playerScore.textContent = player.score;
    
    // Update action buttons
    const hitBtn = document.getElementById('hit-btn');
    const standBtn = document.getElementById('stand-btn');
    const doubleBtn = document.getElementById('double-btn');
    
    hitBtn.disabled = player.busted || player.stand;
    standBtn.disabled = player.busted || player.stand;
    doubleBtn.disabled = player.busted || player.stand || player.hand.length > 2;
}

function updateOpponentsDisplay() {
    const opponentsContainer = document.getElementById('opponents-container');
    opponentsContainer.innerHTML = '';
    
    // Skip first player (human player)
    for (let i = 1; i < gameState.currentGame.players.length; i++) {
        const player = gameState.currentGame.players[i];
        const opponentElement = createOpponentElement(player);
        opponentsContainer.appendChild(opponentElement);
    }
}

function createOpponentElement(player) {
    const opponent = document.createElement('div');
    opponent.className = 'opponent';
    
    const name = document.createElement('div');
    name.className = 'opponent-name';
    name.textContent = player.name;
    
    const score = document.createElement('div');
    score.className = 'opponent-score';
    score.textContent = player.score;
    
    opponent.appendChild(name);
    opponent.appendChild(score);
    
    return opponent;
}

function createCardElement(card, hidden = false) {
    const cardElement = document.createElement('div');
    cardElement.className = `card ${card.isRed ? 'red' : ''} ${hidden ? 'hidden' : ''}`;
    
    if (!hidden) {
        cardElement.textContent = card.displayValue;
    }
    
    return cardElement;
}

// Game actions
function hit() {
    const player = gameState.currentGame.players[0];
    if (player.busted || player.stand) return;
    
    player.addCard(gameState.currentGame.deck.draw());
    updateGameDisplay();
    
    if (player.busted) {
        setTimeout(() => endPlayerTurn, 1000);
    }
}

function stand() {
    const player = gameState.currentGame.players[0];
    if (player.busted || player.stand) return;
    
    player.stand = true;
    updateGameDisplay();
    setTimeout(endPlayerTurn, 1000);
}

function double() {
    const player = gameState.currentGame.players[0];
    if (player.busted || player.stand || player.hand.length > 2) return;
    
    player.addCard(gameState.currentGame.deck.draw());
    player.stand = true;
    updateGameDisplay();
    setTimeout(endPlayerTurn, 1000);
}

function endPlayerTurn() {
    // Play AI turns
    gameState.currentGame.playAITurn();
    updateGameDisplay();
    
    setTimeout(() => {
        // Play dealer turn
        gameState.currentGame.playDealerTurn();
        updateGameDisplay();
        
        setTimeout(() => {
            // Determine winner
            const results = gameState.currentGame.determineRoundWinner();
            showRoundResults(results);
        }, 1000);
    }, 1000);
}

function showRoundResults(results) {
    // Update stats
    const playerResult = results[0]; // Human player is first
    if (playerResult.result === 'win') {
        gameState.gameStats.gamesWon++;
        gameState.gameStats.bestHand = Math.max(gameState.gameStats.bestHand, playerResult.score);
    }
    
    // Check if game is over
    if (gameState.currentGame.isGameOver()) {
        endGame();
    } else {
        // Show round result and continue
        setTimeout(() => {
            gameState.currentGame.nextRound();
            updateGameDisplay();
        }, 2000);
    }
}

function endGame() {
    const finalResults = gameState.currentGame.getFinalResults();
    const playerPosition = finalResults.findIndex(r => r.name === 'Player') + 1;
    
    // Update ELO based on position
    updateElo(playerPosition);
    
    // Update stats
    gameState.gameStats.gamesPlayed++;
    
    // Show game over message
    setTimeout(() => {
        alert(`Game Over! You finished in ${playerPosition}${getOrdinalSuffix(playerPosition)} place.`);
        showMainMenu();
    }, 1000);
}

function getOrdinalSuffix(num) {
    if (num === 1) return 'st';
    if (num === 2) return 'nd';
    if (num === 3) return 'rd';
    return 'th';
}

function updateElo(position) {
    let eloChange = 0;
    
    if (gameState.currentGame.mode === '1v1') {
        // 1v1: Win = +25, Lose = -25
        eloChange = position === 1 ? 25 : -25;
    } else if (gameState.currentGame.mode === '2v2') {
        // 2v2: Winning team = +20, Losing team = -20
        eloChange = position <= 2 ? 20 : -20;
    } else if (gameState.currentGame.mode === 'ffa') {
        // FFA: 1st = +30, 2nd = +15, 3rd = +5, 4th+ = 0
        if (position === 1) eloChange = 30;
        else if (position === 2) eloChange = 15;
        else if (position === 3) eloChange = 5;
        else eloChange = 0;
    }
    
    gameState.playerElo = Math.max(1, gameState.playerElo + eloChange);
}

// Initialize game
document.addEventListener('DOMContentLoaded', function() {
    // Load saved stats from localStorage
    const savedElo = localStorage.getItem('playerElo');
    const savedStats = localStorage.getItem('gameStats');
    
    if (savedElo) {
        gameState.playerElo = parseInt(savedElo);
    }
    
    if (savedStats) {
        gameState.gameStats = JSON.parse(savedStats);
    }
    
    // Save stats to localStorage when they change
    setInterval(() => {
        localStorage.setItem('playerElo', gameState.playerElo.toString());
        localStorage.setItem('gameStats', JSON.stringify(gameState.gameStats));
    }, 5000);
    
    // Close modal when clicking outside
    window.onclick = function(event) {
        const modal = document.getElementById('coming-soon-modal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
});
