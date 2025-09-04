# Snake Game Integration Setup

## Overview
This document explains how to set up and run the Snake game integration with the URL-shortener frontend.

## Prerequisites
- Python 3.7 or higher
- pip package manager

## Setup Instructions

### 1. Install Game Dependencies
```bash
cd URL-shortener
pip install -r requirements.txt
```

### 2. Run the Game Server
```bash
python run_game.py
```
This will start the game server on `http://localhost:8000`

### 3. Run the Frontend
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```

### 4. Access the Game
1. Open the frontend in your browser (usually `http://localhost:5173`)
2. Click the "Play Snake Game" button
3. The game will open in a modal window

## Game Controls
- **Arrow Keys** or **WASD**: Move the snake
- **Escape**: Quit the game
- **Mouse**: Click buttons in the game interface

## Technical Details
- The game runs using **pygbag** which converts the Python Pygame code to WebAssembly
- The frontend displays the game in an **iframe** pointing to `localhost:8000`
- The game is fully self-contained and doesn't require backend modifications

## Troubleshooting
- If the game doesn't load, ensure the game server is running on port 8000
- Make sure both pygame-ce and pygbag are installed correctly
- Check that no other service is using port 8000