// Game state
let currentScreen = 'mainMenu';
let gameMode = '';
let currentRound = 1;
let totalRounds = 5;
let playerElo = 1000;
let gameStats = {
    gamesPlayed: 0,
    wins: 0,
    bestStreak: 0,
    currentStreak: 0
};

// AI usernames
const regularAI = [
    'Alex', 'Sam', 'Jordan', 'Casey', 'Morgan', 'Taylor', 'Riley', 'Quinn',
    'Avery', 'Blake', 'Cameron', 'Drew', 'Emery', 'Finley', 'Gray', 'Harper'
];

const highRankedAI = [
    'Shadow', 'Viper', 'Phoenix', 'Raven', 'Wolf', 'Eagle', 'Tiger', 'Dragon',
    'Frost', 'Blaze', 'Storm', 'Thunder', 'Void', 'Nova', 'Zen', 'Apex'
];

// Card deck
const suits = ['♠', '♥', '♦', '♣'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

// Game variables
let deck = [];
let players = [];
let currentPlayerIndex = 0;
let gameEnded = false;
let queueTimer = null;
let queueStartTime = 0;

// Initialize the game
document.addEventListener('DOMContentLoaded', function() {
    loadStats();
    showScreen('mainMenu');
});

// Screen management
function showScreen(screenName) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show target screen
    document.getElementById(screenName + 'Screen').classList.add('active');
    currentScreen = screenName;
}

function showMainMenu() {
    showScreen('mainMenu');
}

function showGameMode(mode) {
    if (mode === 'casual') {
        showScreen('gameMode');
    }
}

function showComingSoon(feature) {
    document.getElementById('comingSoonTitle').textContent = feature;
    document.getElementById('comingSoonModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('comingSoonModal').style.display = 'none';
}

function showTutorial() {
    showScreen('tutorial');
}

function showSettings() {
    showScreen('settings');
}

function showStats() {
    updateStatsDisplay();
    showScreen('stats');
}

function toggleDarkMode() {
    // Dark mode is already implemented in CSS
    // This function can be expanded for additional dark mode features
}

// Game mode selection
function selectGameMode(mode) {
    gameMode = mode;
    
    // Set total rounds based on game mode
    if (mode === 'ffa') {
        totalRounds = 10;
    } else {
        totalRounds = 5;
    }
    
    // Start queue
    startQueue();
}

// Queue system
function startQueue() {
    showScreen('queue');
    
    // Update queue display
    document.getElementById('queueGameMode').textContent = gameMode.toUpperCase();
    document.getElementById('queueElo').textContent = playerElo;
    
    // Calculate queue time based on ELO (3-20 seconds)
    const queueTime = Math.min(20, Math.max(3, Math.floor(playerElo / 100)));
    
    queueStartTime = Date.now();
    let elapsed = 0;
    
    queueTimer = setInterval(() => {
        elapsed = Math.floor((Date.now() - queueStartTime) / 1000);
        document.getElementById('queueTime').textContent = elapsed + 's';
        
        if (elapsed >= queueTime) {
            clearInterval(queueTimer);
            startGame();
        }
    }, 1000);
}

function cancelQueue() {
    if (queueTimer) {
        clearInterval(queueTimer);
    }
    showScreen('gameMode');
}

// Game initialization
function startGame() {
    currentRound = 1;
    gameEnded = false;
    
    // Initialize players based on game mode
    initializePlayers();
    
    // Initialize deck
    initializeDeck();
    
    // Deal initial cards
    dealInitialCards();
    
    // Show game screen
    showScreen('game');
    updateGameDisplay();
}

function initializePlayers() {
    players = [];
    
    // Add human player
    players.push({
        name: 'You',
        hand: [],
        score: 0,
        isHuman: true,
        isAI: false,
        team: 1
    });
    
    // Add AI players based on game mode
    if (gameMode === '1v1') {
        players.push({
            name: getRandomAIName(),
            hand: [],
            score: 0,
            isHuman: false,
            isAI: true,
            team: 2
        });
    } else if (gameMode === '2v2') {
        // Add 3 AI players (2 for team 2, 1 for team 1)
        players.push({
            name: getRandomAIName(),
            hand: [],
            score: 0,
            isHuman: false,
            isAI: true,
            team: 1
        });
        players.push({
            name: getRandomAIName(),
            hand: [],
            score: 0,
            isHuman: false,
            isAI: true,
            team: 2
        });
        players.push({
            name: getRandomAIName(),
            hand: [],
            score: 0,
            isHuman: false,
            isAI: true,
            team: 2
        });
    } else if (gameMode === 'ffa') {
        // Add 4 AI players for FFA
        for (let i = 0; i < 4; i++) {
            players.push({
                name: getRandomAIName(),
                hand: [],
                score: 0,
                isHuman: false,
                isAI: true,
                team: i + 2
            });
        }
    }
    
    currentPlayerIndex = 0;
}

function getRandomAIName() {
    // 70% chance for regular AI, 30% for high ranked
    if (Math.random() < 0.7) {
        return regularAI[Math.floor(Math.random() * regularAI.length)];
    } else {
        return highRankedAI[Math.floor(Math.random() * highRankedAI.length)];
    }
}

function initializeDeck() {
    deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
    shuffleDeck();
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function dealInitialCards() {
    // Deal 2 cards to each player
    for (let i = 0; i < 2; i++) {
        for (let player of players) {
            const card = deck.pop();
            player.hand.push(card);
        }
    }
    
    // Update scores
    for (let player of players) {
        player.score = calculateHandValue(player.hand);
    }
}

function calculateHandValue(hand) {
    let value = 0;
    let aces = 0;
    
    for (let card of hand) {
        if (card.value === 'A') {
            aces++;
        } else if (['K', 'Q', 'J'].includes(card.value)) {
            value += 10;
        } else {
            value += parseInt(card.value);
        }
    }
    
    // Add aces
    for (let i = 0; i < aces; i++) {
        if (value + 11 <= 21) {
            value += 11;
        } else {
            value += 1;
        }
    }
    
    return value;
}

// Game actions
function hit() {
    if (gameEnded || !players[currentPlayerIndex].isHuman) return;
    
    const player = players[currentPlayerIndex];
    const card = deck.pop();
    player.hand.push(card);
    player.score = calculateHandValue(player.hand);
    
    if (player.score > 21) {
        // Player busted
        nextPlayer();
    }
    
    updateGameDisplay();
}

function stand() {
    if (gameEnded || !players[currentPlayerIndex].isHuman) return;
    
    nextPlayer();
}

function nextPlayer() {
    currentPlayerIndex++;
    
    if (currentPlayerIndex >= players.length) {
        // All players have played, determine winner
        determineRoundWinner();
    } else if (players[currentPlayerIndex].isAI) {
        // AI turn
        setTimeout(playAITurn, 1000);
    }
    
    updateGameDisplay();
}

function playAITurn() {
    if (gameEnded) return;
    
    const player = players[currentPlayerIndex];
    
    // Simple AI logic: hit if score < 17, stand otherwise
    while (player.score < 17 && player.score <= 21) {
        const card = deck.pop();
        player.hand.push(card);
        player.score = calculateHandValue(player.hand);
    }
    
    nextPlayer();
}

function determineRoundWinner() {
    // Find the best score (closest to 21 without busting)
    let bestScore = 0;
    let winners = [];
    
    for (let player of players) {
        if (player.score <= 21 && player.score > bestScore) {
            bestScore = player.score;
            winners = [player];
        } else if (player.score <= 21 && player.score === bestScore) {
            winners.push(player);
        }
    }
    
    // Update round scores
    for (let winner of winners) {
        winner.roundWins = (winner.roundWins || 0) + 1;
    }
    
    // Check if game is over
    if (currentRound >= totalRounds) {
        endGame();
    } else {
        // Show next round button
        document.getElementById('nextRoundBtn').style.display = 'inline-block';
        document.getElementById('hitBtn').disabled = true;
        document.getElementById('standBtn').disabled = true;
    }
    
    updateGameDisplay();
}

function nextRound() {
    currentRound++;
    
    // Reset hands and scores
    for (let player of players) {
        player.hand = [];
        player.score = 0;
    }
    
    // Reset deck
    initializeDeck();
    
    // Deal new cards
    dealInitialCards();
    
    // Reset current player
    currentPlayerIndex = 0;
    
    // Hide next round button and enable game controls
    document.getElementById('nextRoundBtn').style.display = 'none';
    document.getElementById('hitBtn').disabled = false;
    document.getElementById('standBtn').disabled = false;
    
    updateGameDisplay();
}

function endGame() {
    gameEnded = true;
    
    // Calculate final results
    let results = [];
    
    if (gameMode === '1v1') {
        // 1v1: highest round wins
        const player1Wins = players[0].roundWins || 0;
        const player2Wins = players[1].roundWins || 0;
        
        if (player1Wins > player2Wins) {
            results = [{ player: players[0], position: 1, eloGain: 25 }];
        } else if (player2Wins > player1Wins) {
            results = [{ player: players[1], position: 1, eloGain: 25 }];
        } else {
            results = [{ player: players[0], position: 1, eloGain: 0 }];
        }
    } else if (gameMode === '2v2') {
        // 2v2: team with most wins
        const team1Wins = (players[0].roundWins || 0) + (players[1].roundWins || 0);
        const team2Wins = (players[2].roundWins || 0) + (players[3].roundWins || 0);
        
        if (team1Wins > team2Wins) {
            results = [
                { player: players[0], position: 1, eloGain: 20 },
                { player: players[1], position: 1, eloGain: 20 }
            ];
        } else if (team2Wins > team1Wins) {
            results = [
                { player: players[2], position: 1, eloGain: 20 },
                { player: players[3], position: 1, eloGain: 20 }
            ];
        }
    } else if (gameMode === 'ffa') {
        // FFA: rank by round wins
        const sortedPlayers = [...players].sort((a, b) => (b.roundWins || 0) - (a.roundWins || 0));
        
        for (let i = 0; i < sortedPlayers.length; i++) {
            let eloGain = 0;
            if (i === 0) eloGain = 30; // 1st place
            else if (i === 1) eloGain = 15; // 2nd place
            else if (i === 2) eloGain = 5;  // 3rd place
            
            results.push({
                player: sortedPlayers[i],
                position: i + 1,
                eloGain: eloGain
            });
        }
    }
    
    // Update ELO and stats
    for (let result of results) {
        if (result.player.isHuman) {
            playerElo += result.eloGain;
            if (result.position === 1) {
                gameStats.wins++;
                gameStats.currentStreak++;
                if (gameStats.currentStreak > gameStats.bestStreak) {
                    gameStats.bestStreak = gameStats.currentStreak;
                }
            } else {
                gameStats.currentStreak = 0;
            }
        }
    }
    
    gameStats.gamesPlayed++;
    
    // Save stats
    saveStats();
    
    // Show results and return to menu after delay
    setTimeout(() => {
        alert(`Game Over! Your final ELO: ${playerElo}`);
        showMainMenu();
    }, 2000);
}

// Display updates
function updateGameDisplay() {
    // Update round display
    document.getElementById('currentRound').textContent = currentRound;
    document.getElementById('totalRounds').textContent = totalRounds;
    document.getElementById('gameModeDisplay').textContent = gameMode.toUpperCase();
    
    // Update score display
    updateScoreDisplay();
    
    // Update players display
    updatePlayersDisplay();
    
    // Update game controls
    updateGameControls();
}

function updateScoreDisplay() {
    const scoreDisplay = document.getElementById('scoreDisplay');
    let scoreHTML = '';
    
    if (gameMode === '2v2') {
        const team1Score = (players[0].roundWins || 0) + (players[1].roundWins || 0);
        const team2Score = (players[2].roundWins || 0) + (players[3].roundWins || 0);
        scoreHTML = `Team 1: ${team1Score} | Team 2: ${team2Score}`;
    } else {
        for (let player of players) {
            scoreHTML += `${player.name}: ${player.roundWins || 0} `;
        }
    }
    
    scoreDisplay.innerHTML = scoreHTML;
}

function updatePlayersDisplay() {
    const container = document.getElementById('playersContainer');
    container.innerHTML = '';
    
    for (let i = 0; i < players.length; i++) {
        const player = players[i];
        const playerCard = document.createElement('div');
        playerCard.className = 'player-card';
        
        if (i === currentPlayerIndex && !gameEnded) {
            playerCard.classList.add('active');
        }
        
        if (player.roundWins && player.roundWins > 0) {
            playerCard.classList.add('winner');
        }
        
        let handHTML = '';
        for (let card of player.hand) {
            handHTML += `<div class="card">${card.value}${card.suit}</div>`;
        }
        
        playerCard.innerHTML = `
            <div class="player-name">${player.name}</div>
            <div class="player-hand">${handHTML}</div>
            <div class="player-score">${player.score}</div>
        `;
        
        container.appendChild(playerCard);
    }
}

function updateGameControls() {
    const hitBtn = document.getElementById('hitBtn');
    const standBtn = document.getElementById('standBtn');
    
    if (gameEnded || !players[currentPlayerIndex]?.isHuman) {
        hitBtn.disabled = true;
        standBtn.disabled = true;
    } else {
        hitBtn.disabled = false;
        standBtn.disabled = false;
    }
}

function updateStatsDisplay() {
    document.getElementById('currentElo').textContent = playerElo;
    document.getElementById('gamesPlayed').textContent = gameStats.gamesPlayed;
    document.getElementById('winRate').textContent = gameStats.gamesPlayed > 0 ? 
        Math.round((gameStats.wins / gameStats.gamesPlayed) * 100) + '%' : '0%';
    document.getElementById('bestStreak').textContent = gameStats.bestStreak;
}

// Stats management
function saveStats() {
    localStorage.setItem('blackjackStats', JSON.stringify({
        playerElo,
        gameStats
    }));
}

function loadStats() {
    const saved = localStorage.getItem('blackjackStats');
    if (saved) {
        const data = JSON.parse(saved);
        playerElo = data.playerElo || 1000;
        gameStats = data.gameStats || {
            gamesPlayed: 0,
            wins: 0,
            bestStreak: 0,
            currentStreak: 0
        };
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('comingSoonModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}
