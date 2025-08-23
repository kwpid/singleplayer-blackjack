# Single Player Blackjack

A feature-rich single-player blackjack game with multiple game modes, AI opponents, and an ELO ranking system.

## Features

### 🎮 Game Modes
- **1v1**: Player vs AI - 5 rounds, best of 5
- **2v2**: Team vs Team - 5 rounds, best of 5  
- **FFA**: Free for All (2-5 players) - 10 rounds, highest score wins

### 🏆 ELO System
- Players start at 1,000 ELO
- ELO changes based on performance and game mode
- Higher ELO = longer queue times (3-20 seconds)
- Casual mode uses single ELO across all game types

### 🤖 AI Opponents
- **Regular AI**: 70% chance (Alex, Sam, Jordan, etc.)
- **High Ranked AI**: 30% chance (Shadow, Viper, Phoenix, etc.)
- No prefixes or suffixes - clean usernames

### 📊 Statistics & Progress
- Comprehensive player statistics
- Win/loss records by game mode
- Best winning streaks
- Overall win rate tracking

### 🎨 User Interface
- Dark mode theme with modern design
- Responsive layout for all devices
- Smooth animations and transitions
- Intuitive navigation between screens

## How to Play

### Basic Rules
1. **Objective**: Get as close to 21 as possible without going over
2. **Card Values**:
   - 2-10: Face value
   - J, Q, K: 10 points
   - A: 1 or 11 (automatically optimized)
3. **Actions**:
   - **Hit**: Take another card
   - **Stand**: Keep your current hand
   - **Double**: Double your bet and take one more card

### Game Flow
1. Select **Casual** from the main menu
2. Choose your preferred game mode (1v1, 2v2, or FFA)
3. Wait in queue (time varies by ELO)
4. Play through multiple rounds
5. Win rounds to increase your ELO
6. View your progress in the Stats section

### ELO Rewards
- **1v1**: Win 10-35 ELO, Lose 5-25 ELO
- **2v2**: Win 15-45 ELO, Lose 10-35 ELO  
- **FFA**: 1st place = 50 ELO, 2nd = 25 ELO, 3rd = 10 ELO

## File Structure

```
singleplayer-blackjack/
├── index.html          # Main game interface
├── styles.css          # Dark theme styling
├── script.js           # Game logic and AI
└── README.md           # This file
```

## Getting Started

1. Open `index.html` in a modern web browser
2. No installation or dependencies required
3. Game data is saved locally in your browser
4. Works offline after initial load

## Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Game Features

### Menu System
- **Casual**: Play for fun with ELO tracking
- **Ranked**: Coming soon - competitive play
- **Tutorial**: Learn blackjack rules
- **Settings**: Customize game preferences
- **Leaderboards**: Coming soon - global rankings
- **Stats**: View your performance history

### Queue System
- Realistic wait times based on ELO
- Cancel queue option
- Animated loading spinner
- Estimated wait time display

### Game Interface
- Clear card visualization
- Real-time score updates
- Round progress tracking
- Action button management
- Responsive game board layout

## Technical Details

- **Frontend**: Pure HTML/CSS/JavaScript
- **Storage**: Local browser storage
- **AI**: Rule-based decision making
- **Responsive**: Mobile-first design
- **Performance**: Optimized card rendering

## Future Enhancements

- [ ] Ranked mode with seasonal resets
- [ ] Global leaderboards
- [ ] Sound effects and music
- [ ] Card animations
- [ ] Tournament mode
- [ ] Custom AI difficulty levels
- [ ] Multiplayer support

## Contributing

This is a single-player project, but suggestions and feedback are welcome!

## License

Free to use and modify for personal projects.

---

**Enjoy playing Single Player Blackjack!** 🃏♠️♥️♦️♣️
