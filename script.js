// Game state
let currentScreen = 'menu';
let gameMode = '';
let gameType = '';
let currentRound = 1;
let totalRounds = 5;
let playerWins = 0;
let aiWins = 0;
let playerElo = 1000;
let gameInProgress = false;
let queueTimer = null;
let currentDeck = [];
let playerHand = [];
let dealerHand = [];
let aiPlayers = [];
let gameHistory = [];
let currentTurn = 'player'; // 'player', 'ai', 'dealer'
let currentAITurn = 0;
let turnDelay = 1000; // 1 second delay between AI turns

// AI Names
const regularAINames = [
    'Alex', 'Sam', 'Jordan', 'Casey', 'Riley', 'Taylor', 'Morgan', 'Quinn',
    'Blake', 'Drew', 'Avery', 'Cameron', 'Parker', 'Reese', 'Sage', 'Rowan'
];

const highRankedAINames = [
    'Shadow', 'Viper', 'Phoenix', 'Raven', 'Blade', 'Storm', 'Thunder', 'Frost',
    'Ember', 'Nova', 'Zen', 'Echo', 'Pulse', 'Flux', 'Vortex', 'Quantum'
];

// Player statistics
let playerStats = {
    gamesPlayed: 0,
    totalWins: 0,
    totalLosses: 0,
    bestStreak: 0,
    currentStreak: 0,
    modeStats: {
        '1v1': { wins: 0, losses: 0 },
        '2v2': { wins: 0, losses: 0 },
        'FFA': { wins: 0, losses: 0 }
    }
};

// Load saved data
function loadGameData() {
    const savedElo = localStorage.getItem('playerElo');
    const savedStats = localStorage.getItem('playerStats');
    
    if (savedElo) {
        playerElo = parseInt(savedElo);
        document.getElementById('playerElo').textContent = playerElo;
        document.getElementById('currentElo').textContent = playerElo;
    }
    
    if (savedStats) {
        playerStats = JSON.parse(savedStats);
        updateStatsDisplay();
    }
}

// Save game data
function saveGameData() {
    localStorage.setItem('playerElo', playerElo.toString());
    localStorage.setItem('playerStats', JSON.stringify(playerStats));
}

// Screen management
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
    currentScreen = screenId;
}

function showMenu() {
    showScreen('menuScreen');
    resetGameState();
}

function showGameModes(type) {
    gameType = type;
    document.getElementById('modesTitle').textContent = `Select ${type.charAt(0).toUpperCase() + type.slice(1)} Game Mode`;
    showScreen('gameModesScreen');
}

function showTutorial() {
    showScreen('tutorialScreen');
}

function showSettings() {
    showScreen('settingsScreen');
}

function showStats() {
    updateStatsDisplay();
    showScreen('statsScreen');
}

// Game mode selection
function selectGameMode(mode) {
    gameMode = mode;
    
    if (mode === '1v1') {
        totalRounds = 5;
        startQueue();
    } else if (mode === '2v2') {
        totalRounds = 5;
        startQueue();
    } else if (mode === 'FFA') {
        totalRounds = 10;
        startQueue();
    }
}

// Queue system
function startQueue() {
    showScreen('queueScreen');
    
    // Calculate queue time based on ELO (3-20 seconds)
    const baseTime = 3;
    const maxTime = 20;
    const eloFactor = Math.min((playerElo - 1000) / 1000, 1); // 0 to 1
    const queueTime = Math.floor(baseTime + (eloFactor * (maxTime - baseTime)));
    
    document.getElementById('waitTime').textContent = queueTime;
    
    // Simulate queue time
    queueTimer = setTimeout(() => {
        startGame();
    }, queueTime * 1000);
}

function cancelQueue() {
    if (queueTimer) {
        clearTimeout(queueTimer);
        queueTimer = null;
    }
    showMenu();
}

// Game initialization
function startGame() {
    showScreen('gameScreen');
    initializeGame();
}

function initializeGame() {
    currentRound = 1;
    playerWins = 0;
    aiWins = 0;
    gameInProgress = false;
    
    // Set up AI players based on game mode
    setupAIPlayers();
    
    // Update display
    updateGameDisplay();
    startNewRound();
}

function setupAIPlayers() {
    aiPlayers = [];
    
    if (gameMode === '1v1') {
        const aiName = getRandomAIName();
        aiPlayers.push({
            name: aiName,
            hand: [],
            score: 0,
            isAI: true,
            status: 'Waiting...'
        });
    } else if (gameMode === '2v2') {
        // 2 AI players on one team
        for (let i = 0; i < 2; i++) {
            const aiName = getRandomAIName();
            aiPlayers.push({
                name: aiName,
                hand: [],
                score: 0,
                isAI: true,
                status: 'Waiting...'
            });
        }
    } else if (gameMode === 'FFA') {
        // 1-4 AI players (random)
        const numAI = Math.floor(Math.random() * 4) + 1;
        for (let i = 0; i < numAI; i++) {
            const aiName = getRandomAIName();
            aiPlayers.push({
                name: aiName,
                hand: [],
                score: 0,
                isAI: true,
                status: 'Waiting...'
            });
        }
    }
}

function getRandomAIName() {
    // 70% chance for regular AI, 30% for high ranked
    if (Math.random() < 0.7) {
        return regularAINames[Math.floor(Math.random() * regularAINames.length)];
    } else {
        return highRankedAINames[Math.floor(Math.random() * highRankedAINames.length)];
    }
}

// Card deck management
function createDeck() {
    const suits = ['♠', '♥', '♦', '♣'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const deck = [];
    
    for (let suit of suits) {
        for (let value of values) {
            deck.push({
                suit: suit,
                value: value,
                isRed: suit === '♥' || suit === '♦'
            });
        }
    }
    
    return shuffleDeck(deck);
}

function shuffleDeck(deck) {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Round management
function startNewRound() {
    if (currentRound > totalRounds) {
        endGame();
        return;
    }
    
    // Create new deck and deal cards
    currentDeck = createDeck();
    playerHand = [];
    dealerHand = [];
    
    // Reset AI hands and status
    aiPlayers.forEach(ai => {
        ai.hand = [];
        ai.score = 0;
        ai.status = 'Waiting...';
    });
    
    // Reset turn system
    currentTurn = 'player';
    currentAITurn = 0;
    
    // Deal initial cards
    dealInitialCards();
    
    // Update display
    updateGameDisplay();
    updateRoundDisplay();
    
    // Check for blackjack
    if (checkBlackjack(playerHand)) {
        endRound('player');
    } else if (checkBlackjack(dealerHand)) {
        endRound('dealer');
    }
}

function dealInitialCards() {
    // Deal 2 cards to each player
    for (let i = 0; i < 2; i++) {
        playerHand.push(currentDeck.pop());
        dealerHand.push(currentDeck.pop());
        
        // Deal to AI players
        aiPlayers.forEach(ai => {
            ai.hand.push(currentDeck.pop());
        });
    }
    
    // Calculate scores
    updateScores();
}

function updateScores() {
    // Update player score
    const playerScore = calculateHandValue(playerHand);
    document.getElementById('playerScore').textContent = `Score: ${playerScore}`;
    
    // Update dealer score (always show in turn-based system)
    const dealerScore = calculateHandValue(dealerHand);
    document.getElementById('dealerScore').textContent = `Score: ${dealerScore}`;
    
    // Update AI scores
    aiPlayers.forEach((ai, index) => {
        ai.score = calculateHandValue(ai.hand);
    });
}

// Card value calculation
function calculateHandValue(hand) {
    let value = 0;
    let aces = 0;
    
    for (let card of hand) {
        if (card.value === 'A') {
            aces += 1;
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

function checkBlackjack(hand) {
    return hand.length === 2 && calculateHandValue(hand) === 21;
}

// Player actions
function hit() {
    if (!gameInProgress || currentTurn !== 'player') return;
    
    playerHand.push(currentDeck.pop());
    updateScores();
    updateGameDisplay();
    
    if (calculateHandValue(playerHand) > 21) {
        endRound('dealer');
    } else {
        // Player's turn is over, move to AI turn
        currentTurn = 'ai';
        currentAITurn = 0;
        updateGameDisplay();
        setTimeout(playAITurn, turnDelay);
    }
}

function stand() {
    if (!gameInProgress || currentTurn !== 'player') return;
    
    // Player's turn is over, move to AI turn
    currentTurn = 'ai';
    currentAITurn = 0;
    updateGameDisplay();
    setTimeout(playAITurn, turnDelay);
}

function double() {
    if (!gameInProgress || currentTurn !== 'player' || playerHand.length !== 2) return;
    
    playerHand.push(currentDeck.pop());
    updateScores();
    updateGameDisplay();
    
    if (calculateHandValue(playerHand) > 21) {
        endRound('dealer');
    } else {
        // Player's turn is over, move to AI turn
        currentTurn = 'ai';
        currentAITurn = 0;
        updateGameDisplay();
        setTimeout(playAITurn, turnDelay);
    }
}

// AI turn
function playAITurn() {
    if (currentAITurn < aiPlayers.length) {
        // Play current AI player's turn
        const currentAI = aiPlayers[currentAITurn];
        currentAI.status = 'Thinking...';
        updateGameDisplay();
        
        setTimeout(() => {
            // AI decision making
            while (currentAI.score < 17) {
                currentAI.hand.push(currentDeck.pop());
                currentAI.score = calculateHandValue(currentAI.hand);
            }
            
            if (currentAI.score > 21) {
                currentAI.status = 'Bust!';
            } else {
                currentAI.status = 'Stand';
            }
            
            currentAITurn++;
            updateGameDisplay();
            
            // Continue with next AI or move to dealer
            if (currentAITurn < aiPlayers.length) {
                setTimeout(playAITurn, turnDelay);
            } else {
                // All AI players done, dealer's turn
                currentTurn = 'dealer';
                setTimeout(playDealerTurn, turnDelay);
            }
        }, turnDelay);
    }
}

function playDealerTurn() {
    currentTurn = 'dealer';
    updateGameDisplay();
    
    setTimeout(() => {
        // Dealer plays according to rules (hit on 16 or below, stand on 17+)
        while (calculateHandValue(dealerHand) < 17) {
            dealerHand.push(currentDeck.pop());
        }
        
        updateScores();
        updateGameDisplay();
        
        // Determine round winner
        determineRoundWinner();
    }, turnDelay);
}

function determineRoundWinner() {
    const playerScore = calculateHandValue(playerHand);
    const dealerScore = calculateHandValue(dealerHand);
    
    let winner = '';
    
    if (gameMode === '1v1') {
        if (playerScore > 21) {
            winner = 'dealer';
        } else if (dealerScore > 21) {
            winner = 'player';
        } else if (playerScore > dealerScore) {
            winner = 'player';
        } else if (dealerScore > playerScore) {
            winner = 'dealer';
        } else {
            winner = 'tie';
        }
    } else if (gameMode === '2v2') {
        const teamScore = playerScore + aiPlayers[0].score;
        const dealerTeamScore = dealerScore + aiPlayers[1].score;
        
        if (teamScore > 21) {
            winner = 'dealer';
        } else if (dealerTeamScore > 21) {
            winner = 'player';
        } else if (teamScore > dealerTeamScore) {
            winner = 'player';
        } else if (dealerTeamScore > teamScore) {
            winner = 'dealer';
        } else {
            winner = 'tie';
        }
    } else if (gameMode === 'FFA') {
        // FFA logic - highest score wins
        const allScores = [
            { name: 'player', score: playerScore },
            { name: 'dealer', score: dealerScore },
            ...aiPlayers.map(ai => ({ name: ai.name, score: ai.score }))
        ].filter(p => p.score <= 21);
        
        if (allScores.length === 0) {
            winner = 'tie';
        } else {
            const highest = allScores.reduce((max, p) => p.score > max.score ? p : max);
            winner = highest.name;
        }
    }
    
    endRound(winner);
}

// Round and game ending
function endRound(winner) {
    gameInProgress = false;
    
    if (winner === 'player') {
        playerWins++;
    } else if (winner === 'dealer') {
        aiWins++;
    }
    
    // Show round results
    const roundResults = document.getElementById('roundResults');
    const roundWinner = document.getElementById('roundWinner');
    
    if (winner === 'player') {
        roundWinner.textContent = 'You won this round!';
    } else if (winner === 'dealer') {
        roundWinner.textContent = 'AI won this round!';
    } else {
        roundWinner.textContent = 'This round is a tie!';
    }
    
    roundResults.style.display = 'block';
    
    // Disable action buttons
    document.querySelectorAll('#playerActions button').forEach(btn => {
        btn.disabled = true;
    });
}

function nextRound() {
    currentRound++;
    document.getElementById('roundResults').style.display = 'none';
    
    if (currentRound <= totalRounds) {
        startNewRound();
    } else {
        endGame();
    }
}

function endGame() {
    // Calculate ELO changes
    let eloChange = 0;
    let gameResult = '';
    
    if (gameMode === '1v1') {
        if (playerWins > aiWins) {
            gameResult = 'Victory!';
            eloChange = Math.floor((aiWins / totalRounds) * 25) + 10;
        } else if (aiWins > playerWins) {
            gameResult = 'Defeat!';
            eloChange = -Math.floor((playerWins / totalRounds) * 20) - 5;
        } else {
            gameResult = 'Draw!';
            eloChange = 0;
        }
    } else if (gameMode === '2v2') {
        if (playerWins > aiWins) {
            gameResult = 'Team Victory!';
            eloChange = Math.floor((aiWins / totalRounds) * 30) + 15;
        } else if (aiWins > playerWins) {
            gameResult = 'Team Defeat!';
            eloChange = -Math.floor((playerWins / totalRounds) * 25) - 10;
        } else {
            gameResult = 'Team Draw!';
            eloChange = 0;
        }
    } else if (gameMode === 'FFA') {
        // FFA ELO calculation
        const totalPlayers = aiPlayers.length + 2; // +2 for player and dealer
        if (playerWins > 0) {
            const position = Math.max(1, totalPlayers - playerWins);
            if (position === 1) {
                gameResult = '1st Place!';
                eloChange = 50;
            } else if (position === 2) {
                gameResult = '2nd Place!';
                eloChange = 25;
            } else if (position === 3) {
                gameResult = '3rd Place!';
                eloChange = 10;
            } else {
                gameResult = 'Finished';
                eloChange = 0;
            }
        } else {
            gameResult = 'No Points';
            eloChange = -10;
        }
    }
    
    // Update ELO
    playerElo += eloChange;
    playerElo = Math.max(1, playerElo); // Minimum ELO is 1
    
    // Update stats
    updatePlayerStats(gameResult, eloChange);
    
    // Show game results
    const gameResults = document.getElementById('gameResults');
    const gameWinner = document.getElementById('gameWinner');
    const eloChangeDisplay = document.getElementById('eloChange');
    
    gameWinner.textContent = gameResult;
    eloChangeDisplay.innerHTML = `
        <p>ELO Change: <span style="color: ${eloChange >= 0 ? '#2ecc71' : '#e74c3c'}">${eloChange >= 0 ? '+' : ''}${eloChange}</span></p>
        <p>New ELO: ${playerElo}</p>
    `;
    
    gameResults.style.display = 'block';
    
    // Save data
    saveGameData();
}

// Stats management
function updatePlayerStats(result, eloChange) {
    playerStats.gamesPlayed++;
    
    if (eloChange > 0) {
        playerStats.totalWins++;
        playerStats.currentStreak++;
        if (playerStats.currentStreak > playerStats.bestStreak) {
            playerStats.bestStreak = playerStats.currentStreak;
        }
    } else if (eloChange < 0) {
        playerStats.totalLosses++;
        playerStats.currentStreak = 0;
    }
    
    // Update mode-specific stats
    if (result.includes('Victory') || result.includes('1st') || result.includes('2nd') || result.includes('3rd')) {
        playerStats.modeStats[gameMode].wins++;
    } else {
        playerStats.modeStats[gameMode].losses++;
    }
}

function updateStatsDisplay() {
    document.getElementById('currentElo').textContent = playerElo;
    document.getElementById('gamesPlayed').textContent = playerStats.gamesPlayed;
    
    const winRate = playerStats.gamesPlayed > 0 ? 
        Math.round((playerStats.totalWins / playerStats.gamesPlayed) * 100) : 0;
    document.getElementById('winRate').textContent = winRate + '%';
    
    document.getElementById('bestStreak').textContent = playerStats.bestStreak;
    
    // Mode-specific stats
    document.getElementById('v1Wins').textContent = playerStats.modeStats['1v1'].wins;
    document.getElementById('v1Losses').textContent = playerStats.modeStats['1v1'].losses;
    document.getElementById('v2Wins').textContent = playerStats.modeStats['2v2'].wins;
    document.getElementById('v2Losses').textContent = playerStats.modeStats['2v2'].losses;
    document.getElementById('ffaWins').textContent = playerStats.modeStats['FFA'].wins;
    document.getElementById('ffaLosses').textContent = playerStats.modeStats['FFA'].losses;
}

// Display updates
function updateGameDisplay() {
    // Update player hand
    const playerHandElement = document.getElementById('playerHand');
    playerHandElement.innerHTML = '';
    playerHand.forEach(card => {
        playerHandElement.appendChild(createCardElement(card));
    });
    
    // Update dealer hand (always show all cards in turn-based system)
    const dealerHandElement = document.getElementById('dealerHand');
    dealerHandElement.innerHTML = '';
    dealerHand.forEach(card => {
        dealerHandElement.appendChild(createCardElement(card));
    });
    
    // Update AI players display
    updateAIPlayersDisplay();
    
    // Update game mode display
    document.getElementById('gameMode').textContent = gameMode;
    document.getElementById('playerElo').textContent = playerElo;
    
    // Update turn indicator
    updateTurnIndicator();
}

function updateAIPlayersDisplay() {
    const aiPlayersElement = document.getElementById('aiPlayers');
    aiPlayersElement.innerHTML = '';
    
    aiPlayers.forEach((ai, index) => {
        const aiPlayerElement = document.createElement('div');
        aiPlayerElement.className = `ai-player ${currentTurn === 'ai' && currentAITurn === index ? 'active' : ''}`;
        
        aiPlayerElement.innerHTML = `
            <h4>${ai.name}</h4>
            <div class="hand">
                ${ai.hand.map(card => createCardHTML(card)).join('')}
            </div>
            <div class="score">Score: ${ai.score}</div>
            <div class="status">${ai.status}</div>
        `;
        
        aiPlayersElement.appendChild(aiPlayerElement);
    });
}

function createCardHTML(card) {
    return `<div class="card ${card.isRed ? 'red' : ''}">
        <div class="value">${card.value}</div>
        <div class="suit">${card.suit}</div>
    </div>`;
}

function updateTurnIndicator() {
    const gameStatus = document.getElementById('gameStatus');
    
    // Remove active class from all sections
    document.querySelector('.player-section').classList.remove('active');
    document.querySelector('.dealer-section').classList.remove('active');
    
    if (currentTurn === 'player') {
        gameStatus.textContent = 'Your turn - Choose an action';
        gameStatus.style.color = '#2ecc71';
        document.querySelector('.player-section').classList.add('active');
    } else if (currentTurn === 'ai') {
        const currentAI = aiPlayers[currentAITurn];
        gameStatus.textContent = `${currentAI.name} is thinking...`;
        gameStatus.style.color = '#f39c12';
    } else if (currentTurn === 'dealer') {
        gameStatus.textContent = 'Dealer is playing...';
        gameStatus.style.color = '#e74c3c';
        document.querySelector('.dealer-section').classList.add('active');
    }
}

function updateRoundDisplay() {
    document.getElementById('roundInfo').textContent = `Round ${currentRound}/${totalRounds}`;
    
    // Enable action buttons only on player's turn
    document.querySelectorAll('#playerActions button').forEach(btn => {
        btn.disabled = currentTurn !== 'player';
    });
    
    gameInProgress = true;
}

function createCardElement(card) {
    const cardElement = document.createElement('div');
    cardElement.className = `card ${card.isRed ? 'red' : ''}`;
    
    cardElement.innerHTML = `
        <div class="value">${card.value}</div>
        <div class="suit">${card.suit}</div>
    `;
    
    return cardElement;
}

function createHiddenCardElement() {
    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    cardElement.style.background = 'linear-gradient(135deg, #2c3e50, #34495e)';
    cardElement.style.color = '#fff';
    
    cardElement.innerHTML = `
        <div class="value">?</div>
        <div class="suit">?</div>
    `;
    
    return cardElement;
}

function resetGameState() {
    currentRound = 1;
    playerWins = 0;
    aiWins = 0;
    gameInProgress = false;
    currentDeck = [];
    playerHand = [];
    dealerHand = [];
    aiPlayers = [];
    currentTurn = 'player';
    currentAITurn = 0;
    
    // Hide result screens
    document.getElementById('roundResults').style.display = 'none';
    document.getElementById('gameResults').style.display = 'none';
    
    // Reset game status
    document.getElementById('gameStatus').textContent = '';
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadGameData();
    
    // Add settings event listeners
    document.getElementById('soundToggle').addEventListener('change', function() {
        // Sound toggle logic
    });
    
    document.getElementById('musicToggle').addEventListener('change', function() {
        // Music toggle logic
    });
    
    document.getElementById('autoPlay').addEventListener('change', function() {
        // Auto-play toggle logic
    });
});
