import pygame
import random
import sys
import asyncio

# --- Game Constants ---
SCREEN_WIDTH = 600
SCREEN_HEIGHT = 480 # Increased height to accommodate header and margin
GRID_SIZE = 20 # Size of each snake segment and food item

HEADER_HEIGHT = 60 # Height of the top header area for score
HEADER_MARGIN = 10 # Margin between the header and the game body
PADDING = 20       # Padding around the game area for left and right, and bottom

# Calculate the actual game area dimensions based on grid size for perfect alignment
GAME_AREA_LEFT_X = PADDING
GAME_AREA_TOP_Y = HEADER_HEIGHT + HEADER_MARGIN

# Calculate how many grid cells fit horizontally and vertically
GRID_WIDTH_GAME_AREA = (SCREEN_WIDTH - (2 * PADDING)) // GRID_SIZE
GRID_HEIGHT_GAME_AREA = (SCREEN_HEIGHT - GAME_AREA_TOP_Y - PADDING) // GRID_SIZE

# Now calculate the exact pixel dimensions of the game area
GAME_AREA_WIDTH = GRID_WIDTH_GAME_AREA * GRID_SIZE
GAME_AREA_HEIGHT = GRID_HEIGHT_GAME_AREA * GRID_SIZE

# Define the precise boundaries of the playable game area
GAME_AREA_RIGHT_X = GAME_AREA_LEFT_X + GAME_AREA_WIDTH
GAME_AREA_BOTTOM_Y = GAME_AREA_TOP_Y + GAME_AREA_HEIGHT


# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
GREEN = (0, 255, 0)
RED = (255, 0, 0)
BLUE = (0, 0, 255) # For food
GRAY = (50, 50, 50) # For header background
BROWN = (139, 69, 19) # For dead snake
DARK_GREEN = (0, 100, 0) # For button hover

# Snake speed (frames per second)
FPS = 10

# Directions
UP = (0, -1)
DOWN = (0, 1)
LEFT = (-1, 0)
RIGHT = (1, 0)

# Game States
START_SCREEN = 0
PLAYING = 1
GAME_OVER = 2

# --- Pygame Initialization ---
pygame.init()
pygame.display.set_caption("Python Snake Game")
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))

# --- Button Class ---
class Button:
    def __init__(self, x, y, width, height, text, color, hover_color, text_color=WHITE, font=None):
        self.rect = pygame.Rect(x, y, width, height)
        self.text = text
        self.color = color
        self.hover_color = hover_color
        self.text_color = text_color
        self.font = font or pygame.font.Font(None, 36)

    def draw(self, surface):
        action = False
        # Get mouse position
        pos = pygame.mouse.get_pos()

        # Check mouseover and clicked conditions
        if self.rect.collidepoint(pos):
            pygame.draw.rect(surface, self.hover_color, self.rect, border_radius=5)
            if pygame.mouse.get_pressed()[0] == 1: # Left mouse button clicked
                action = True
        else:
            pygame.draw.rect(surface, self.color, self.rect, border_radius=5)
        
        # Render text
        text_surf = self.font.render(self.text, True, self.text_color)
        text_rect = text_surf.get_rect(center=self.rect.center)
        surface.blit(text_surf, text_rect)
        return action

# --- Helper Functions ---

def reset_game():
    """Resets all game variables to their initial state."""
    global snake, food, direction, pending_direction, score, game_state
    
    # Start in the middle of the *game area*
    start_x = (GRID_WIDTH_GAME_AREA // 2) * GRID_SIZE + GAME_AREA_LEFT_X
    start_y = (GRID_HEIGHT_GAME_AREA // 2) * GRID_SIZE + GAME_AREA_TOP_Y
    
    # Initialize snake with 3 segments
    snake = [
        (start_x, start_y),
        (start_x - GRID_SIZE, start_y),
        (start_x - 2 * GRID_SIZE, start_y)
    ]
    
    direction = RIGHT # Reset actual direction
    pending_direction = RIGHT # Reset pending direction
    score = 0 # Reset current score
    game_state = PLAYING # Set state to playing
    place_food()

def place_food():
    """Places the food randomly on the grid within the game area, ensuring it doesn't overlap with the snake."""
    global food
    while True:
        # Random position within the game area grid, then convert to pixel coordinates
        x = random.randrange(0, GRID_WIDTH_GAME_AREA) * GRID_SIZE + GAME_AREA_LEFT_X
        y = random.randrange(0, GRID_HEIGHT_GAME_AREA) * GRID_SIZE + GAME_AREA_TOP_Y
        if (x, y) not in snake:
            food = (x, y)
            break

def draw_game_elements():
    """Draws the snake, food, and game boundaries."""
    # Draw food as a circle
    food_center_x = food[0] + GRID_SIZE // 2
    food_center_y = food[1] + GRID_SIZE // 2
    pygame.draw.circle(screen, BLUE, (food_center_x, food_center_y), GRID_SIZE // 2)

    # Draw snake
    snake_color = BROWN if game_state == GAME_OVER else GREEN # Choose color based on game_state
    for segment in snake:
        pygame.draw.rect(screen, snake_color, (segment[0], segment[1], GRID_SIZE, GRID_SIZE))
    
    # Draw game area border
    pygame.draw.rect(screen, WHITE, 
                     (GAME_AREA_LEFT_X - 1, GAME_AREA_TOP_Y - 1, # -1 for border thickness offset
                      GAME_AREA_WIDTH + 2, GAME_AREA_HEIGHT + 2), 1) # +2 for border thickness

def display_score(font):
    """Displays the current score and highest score in the top header area."""
    # Draw header background
    pygame.draw.rect(screen, GRAY, (0, 0, SCREEN_WIDTH, HEADER_HEIGHT))
    
    current_score_text = font.render(f"Score: {score}", True, WHITE)
    highest_score_text = font.render(f"Highest Score: {highest_score}", True, WHITE)

    # Position current score (left aligned)
    screen.blit(current_score_text, (PADDING, (HEADER_HEIGHT - current_score_text.get_height()) // 2))
    
    # Position highest score (right aligned)
    highest_score_rect = highest_score_text.get_rect(right=SCREEN_WIDTH - PADDING, 
                                                      centery=(HEADER_HEIGHT - highest_score_text.get_height()) // 2 + highest_score_text.get_height() // 2)
    screen.blit(highest_score_text, highest_score_rect)

    # Draw a line to separate header from game area (at the bottom of HEADER_HEIGHT)
    pygame.draw.line(screen, WHITE, (0, HEADER_HEIGHT), (SCREEN_WIDTH, HEADER_HEIGHT), 2)

def draw_start_screen(font, title_font):
    """Draws the start screen with title, instructions, and a start button."""
    screen.fill(BLACK)
    
    # Title
    title_text = title_font.render("Python Snake", True, GREEN)
    title_rect = title_text.get_rect(center=(SCREEN_WIDTH // 2, SCREEN_HEIGHT // 4))
    screen.blit(title_text, title_rect)

    # Instructions
    instructions_text1 = font.render("Use Arrow Keys or WASD to Move", True, WHITE)
    instructions_text2 = font.render("Eat the blue circles to grow!", True, WHITE)
    instructions_text3 = font.render("Don't hit the walls or yourself.", True, WHITE)
    
    instructions_rect1 = instructions_text1.get_rect(center=(SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2 - 40))
    instructions_rect2 = instructions_text2.get_rect(center=(SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2))
    instructions_rect3 = instructions_text3.get_rect(center=(SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2 + 40))
    
    screen.blit(instructions_text1, instructions_rect1)
    screen.blit(instructions_text2, instructions_rect2)
    screen.blit(instructions_text3, instructions_rect3)

    # Start Button
    start_button = Button(SCREEN_WIDTH // 2 - 75, SCREEN_HEIGHT * 3 // 4, 150, 50, "Start Game", GREEN, DARK_GREEN, font=font)
    if start_button.draw(screen):
        reset_game() # Start the game

def draw_game_over_screen(font, large_font):
    """Displays the 'Game Over' message and restart button."""
    game_over_text = large_font.render("Game Over!", True, RED)
    
    # Position messages relative to the center of the *game area*
    center_x = SCREEN_WIDTH // 2
    center_y = (GAME_AREA_TOP_Y + GAME_AREA_BOTTOM_Y) // 2

    game_over_rect = game_over_text.get_rect(center=(center_x, center_y - 40))
    screen.blit(game_over_text, game_over_rect)

    # Restart Button
    restart_button = Button(SCREEN_WIDTH // 2 - 75, center_y + 20, 150, 50, "Restart", GREEN, DARK_GREEN, font=font)
    if restart_button.draw(screen):
        reset_game() # Restart the game

# --- Game Logic ---

def update_snake_position():
    """Moves the snake's head and handles eating food or removing the tail."""
    global snake, food, score, game_state, direction, pending_direction, highest_score

    if game_state != PLAYING: # Only update if game is playing
        return

    # Apply the pending direction change for this tick
    direction = pending_direction

    # Calculate new head position
    head_x = snake[0][0] + direction[0] * GRID_SIZE
    head_y = snake[0][1] + direction[1] * GRID_SIZE
    new_head = (head_x, head_y)

    # Check for collisions
    # Wall collision (respecting precise game area boundaries)
    if not (GAME_AREA_LEFT_X <= head_x < GAME_AREA_RIGHT_X and 
            GAME_AREA_TOP_Y <= head_y < GAME_AREA_BOTTOM_Y):
        game_state = GAME_OVER # Change state to game over
        if score > highest_score: # Update highest score on game over
            highest_score = score
        return
    
    # Self-collision (check if new_head is in any part of the snake)
    if new_head in snake:
        game_state = GAME_OVER # Change state to game over
        if score > highest_score: # Update highest score on game over
            highest_score = score
        return

    snake.insert(0, new_head) # Add new head

    # Check if food is eaten
    if new_head == food:
        score += 1
        place_food() # Place new food
    else:
        snake.pop() # Remove tail if no food eaten (snake doesn't grow)

def handle_input(event):
    """Processes keyboard input to change snake direction."""
    global pending_direction, direction, game_state # Need access to both

    if event.type == pygame.KEYDOWN:
        if game_state == PLAYING:
            # Only allow changing pending_direction if it's not a direct reverse of the *current* snake direction.
            # This prevents queuing an immediate U-turn.
            if (event.key == pygame.K_UP or event.key == pygame.K_w) and direction != DOWN:
                pending_direction = UP
            elif (event.key == pygame.K_DOWN or event.key == pygame.K_s) and direction != UP:
                pending_direction = DOWN
            elif (event.key == pygame.K_LEFT or event.key == pygame.K_a) and direction != RIGHT:
                pending_direction = LEFT
            elif (event.key == pygame.K_RIGHT or event.key == pygame.K_d) and direction != LEFT:
                pending_direction = RIGHT
        
        # Allow quitting from any state
        if event.key == pygame.K_ESCAPE: 
            return False # Signal to exit game loop
    return True # Signal to continue game loop

# --- Main Game Loop ---

async def main():
    # Encapsulated variable declarations
    clock = pygame.time.Clock()
    font = pygame.font.Font(None, 36) # Default font, size 36
    large_font = pygame.font.Font(None, 48) # Larger font for Game Over
    title_font = pygame.font.Font(None, 72) # Even larger font for title
    
    global snake, food, direction, pending_direction, score, highest_score, game_state
    snake = []
    food = (0, 0)
    direction = RIGHT # Current actual movement direction
    pending_direction = RIGHT # The direction that will be applied on the next tick
    score = 0
    highest_score = 0 # To store the highest score achieved
    game_state = START_SCREEN # Initial game state
    
    running = True

    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            else:
                # Handle general input (like quitting)
                if not handle_input(event):
                    running = False
                
                # Handle mouse clicks for buttons
                if event.type == pygame.MOUSEBUTTONDOWN:
                    if game_state == START_SCREEN:
                        # Button logic is handled within draw_start_screen()
                        pass 
                    elif game_state == GAME_OVER:
                        # Button logic is handled within draw_game_over_screen()
                        pass

        # Update game state only if playing
        if game_state == PLAYING:
            update_snake_position()

        # Drawing
        screen.fill(BLACK) # Clear screen (fills the whole window)

        if game_state == START_SCREEN:
            draw_start_screen(font, title_font)
        elif game_state == PLAYING or game_state == GAME_OVER:
            display_score(font) # Always show score when playing or game over
            draw_game_elements() # Draw snake and food
            if game_state == GAME_OVER:
                draw_game_over_screen(font, large_font)

        pygame.display.flip() # Update the full display Surface to the screen
        clock.tick(FPS) # Control frame rate
        await asyncio.sleep(0)

    pygame.quit() # Uninitialize pygame modules
    sys.exit() # Exit the program

if __name__ == "__main__":
    asyncio.run(main())