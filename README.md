# Single Player Blackjack

A web-based single-player blackjack game with multiple game modes and an ELO ranking system.

## Features

### Game Modes
- **1v1**: Player vs AI opponent - 5 rounds
- **2v2**: Team vs Team - 5 rounds  
- **FFA**: Free for All (up to 5 players) - 10 rounds

### Gameplay
- Standard blackjack rules
- Hit, Stand, and Double actions
- AI opponents with realistic behavior
- Dealer follows standard rules (hit on 16, stand on 17+)

### ELO System
- Players start at 1,000 ELO
- ELO changes based on game mode and finishing position:
  - **1v1**: Win = +25, Lose = -25
  - **2v2**: Winning team = +20, Losing team = -20
  - **FFA**: 1st = +30, 2nd = +15, 3rd = +5, 4th+ = 0

### Queue System
- Realistic queue times (3-20 seconds)
- Higher ELO = longer wait times
- Cancel queue option available

### AI Opponents
- Regular AI names (Alex, Sam, Jordan, etc.)
- High-ranked AI names (Shadow, Viper, Phoenix, etc.)
- 30% chance for high-ranked opponents

## How to Play

1. **Main Menu**: Choose "Casual" to start playing
2. **Game Mode**: Select 1v1, 2v2, or FFA
3. **Queue**: Wait for matchmaking (3-20 seconds)
4. **Gameplay**: 
   - Use Hit, Stand, or Double buttons
   - Get as close to 21 as possible without going over
   - Beat the dealer's hand
5. **Rounds**: Play multiple rounds to determine the winner
6. **Results**: See your final position and ELO changes

## Controls

- **Hit**: Take another card
- **Stand**: Keep your current hand
- **Double**: Double your bet and take one more card (only available on first two cards)

## Card Values

- Number cards (2-10) = face value
- Face cards (J, Q, K) = 10
- Ace = 1 or 11 (automatically calculated for best hand)

## Installation

1. Download all files to a folder
2. Open `index.html` in a web browser
3. No additional setup required

## Files

- `index.html` - Main game interface
- `styles.css` - Dark theme styling and responsive design
- `script.js` - Game logic and AI behavior
- `README.md` - This file

## Browser Compatibility

Works on all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## Features Coming Soon

- Ranked mode with separate ELO
- Inventory system
- Leaderboards
- Background music
- Sound effects
- More AI difficulty levels

## Technical Details

- Built with vanilla HTML, CSS, and JavaScript
- No external dependencies
- Responsive design for mobile and desktop
- Local storage for saving game progress
- Object-oriented design for clean code structure

## Game Statistics

The game tracks:
- Current ELO rating
- Total games played
- Games won
- Win rate percentage
- Best hand achieved

All statistics are automatically saved to your browser's local storage.
