# Single Player Blackjack Game

A modern, single-player blackjack game built with HTML, CSS, and JavaScript featuring multiple game modes and an ELO ranking system.

## Features

### Game Modes
- **1v1**: Player vs AI - 5 rounds, highest score wins
- **2v2**: Team vs Team - 5 rounds, team with most wins gains ELO
- **FFA**: Free for All - Up to 5 players, 10 rounds, ranked by performance

### Gameplay
- Standard blackjack rules (get closest to 21 without busting)
- Multiple rounds per game
- AI opponents with realistic usernames
- ELO system for progression tracking
- Queue system with realistic wait times (3-20 seconds based on ELO)

### UI Features
- Dark mode theme with modern gradient design
- Responsive design for mobile and desktop
- Smooth animations and hover effects
- Intuitive card display and game controls

## How to Play

1. **Start the Game**: Open `index.html` in your web browser
2. **Select Mode**: Choose from Casual, Ranked (coming soon), or Tutorial
3. **Choose Game Type**: Select 1v1, 2v2, or FFA
4. **Queue**: Wait for matchmaking (simulated)
5. **Play**: Use Hit to draw cards, Stand to keep your hand
6. **Win Rounds**: Get closest to 21 without going over
7. **Complete Game**: Play all rounds to determine final winner

## Game Rules

### Card Values
- Number cards (2-10): Face value
- Face cards (J, Q, K): 10 points
- Ace: 1 or 11 (whichever is better)

### Actions
- **Hit**: Take another card
- **Stand**: Keep your current hand and end your turn

### Winning
- Closest to 21 without busting wins the round
- Most round wins determines the game winner
- ELO gains based on final position and game mode

## ELO System

- **Starting ELO**: 1,000
- **1v1**: Winner gains 25 ELO
- **2v2**: Winning team gains 20 ELO each
- **FFA**: 1st place (30 ELO), 2nd place (15 ELO), 3rd place (5 ELO)

## AI Opponents

The game features two types of AI opponents:
- **Regular AI**: Common names like Alex, Sam, Jordan
- **High Ranked AI**: Cool names like Shadow, Viper, Phoenix

AI difficulty increases with your ELO rating.

## Technical Details

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Storage**: Local storage for game statistics
- **Responsive**: Mobile-first design with CSS Grid and Flexbox
- **No Dependencies**: Pure vanilla implementation

## File Structure

```
singleplayer-blackjack/
├── index.html          # Main game interface
├── styles.css          # Game styling and dark theme
├── script.js           # Game logic and mechanics
└── README.md           # This file
```

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Future Features

- Ranked mode with seasonal resets
- Inventory system for collectibles
- Leaderboards and global rankings
- Sound effects and music
- Additional game modes

## Getting Started

1. Download or clone this repository
2. Open `index.html` in your web browser
3. Start playing immediately - no installation required!

## License

This project is open source and available under the MIT License.

---

Enjoy playing Blackjack! 🃏
