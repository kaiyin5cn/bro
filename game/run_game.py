#!/usr/bin/env python3
"""
Script to run the Snake game with pygbag for web deployment.
This script launches the game on localhost:8000 for iframe integration.
"""

import subprocess
import sys
import os

def run_game():
    """Run the snake game using pygbag."""
    try:
        # Change to the directory containing main.py
        script_dir = os.path.dirname(os.path.abspath(__file__))
        os.chdir(script_dir)
        
        # Run pygbag with the main.py file
        cmd = [
            sys.executable, "-m", "pygbag",
            "--width", "600",
            "--height", "480",
            "--port", "8000",
            "main.py"
        ]
        
        print("Starting Snake Game server on http://localhost:8000")
        print("Press Ctrl+C to stop the server")
        
        subprocess.run(cmd, check=True)
        
    except subprocess.CalledProcessError as e:
        print(f"Error running pygbag: {e}")
        sys.exit(1)
    except KeyboardInterrupt:
        print("\nGame server stopped.")
        sys.exit(0)
    except Exception as e:
        print(f"Unexpected error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    run_game()