// console.log("hello")

//define html element
const board = document.getElementById('game-board');
const instructiontext = document.getElementById('instrection-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highscore');

// // console.log(board);



// define game variable
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let highScore = 0;
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;






//draw game map, snake, food
function draw() {
    board.innerHTML = '';
    drawSnake();
    drawFood();
    updateScore();
}

// draw snake
function drawSnake() {
    snake.forEach((segment) => {
        const snakeElement = createGameElement('div', 'snake');
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
    });
}

// create a snake or food cube/div
function createGameElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

// set the position of snake or food

function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

// testing draw function
// draw();

// draw food function
function drawFood() {
    if (gameStarted) {
        const foodElement = createGameElement('div', 'food');
        setPosition(foodElement, food);
        board.appendChild(foodElement);
    }

}

// generate food
function generateFood() {
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;
    return { x, y };
}


//moving the snake
function move() {
    const head = { ...snake[0] };
    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }
    snake.unshift(head);

    // snake.pop();
    if (head.x === food.x && head.y === food.y) {
        food = generateFood();
        increaseSpeed();
        clearInterval(gameInterval);
        gameInterval = setInterval(() => {
            move();
            checkCollision();
            draw();
        }, gameSpeedDelay);
    } else {
        snake.pop();
    }

}

// testing move
// setInterval(() => {
//     move();
//     draw();
// }, 200);


// stratt game function
function startGame() {
    gameStarted = true;
    instructiontext.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);

}

// key press event listener
function handleKeyPress(event) {
    if ((!gameStarted && event.code === 'space') || (!gameStarted && event.key === ' ')) {
        startGame();
    } else {
        switch (event.key) {
            case 'ArrowUp':
                direction = 'up'
                break;
            case 'ArrowDown':
                direction = 'down'
                break;
            case 'ArrowRight':
                direction = 'right'
                break;
            case 'ArrowLeft':
                direction = 'left'
                break;

        }
    }
}
document.addEventListener('keydown', handleKeyPress);

function increaseSpeed() {
    if (gameSpeedDelay > 300) {
        gameSpeedDelay -= 20;
    } else if (gameSpeedDelay > 200) {
        gameSpeedDelay -= 10;
    } else if (gameSpeedDelay > 100) {
        gameSpeedDelay -= 5;
    } else if (gameSpeedDelay > 50) {
        gameSpeedDelay -= 2;
    }
}



function checkCollision() {
    const head = snake[0];

    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
        resetGame();
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
        }
    }
}



function resetGame() {
    updateHighScore();
    stopGame();
    snake = [{ x: 10, y: 10 }];
    food = generateFood();
    direction = 'right';
    gameSpeedDelay = 200;
    updateScore();
}

function updateScore() {
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3, '0');
}

function stopGame() {
    clearInterval(gameInterval);
    gameStarted = false;
    instructiontext.style.display = 'block';
    logo.style.display = 'block'
}
function updateHighScore() {
    const currentScore = snake.length - 1;
    if (currentScore > highScore) {
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3, '0');
    }
    highScoreText.style.display = 'block';
}



document.addEventListener('touchstart', handleTouchStart);
document.addEventListener('touchmove', handleTouchMove);



let touchStartX;
let touchStartY;



function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event) {
    if (!touchStartX || !touchStartY) {
        return;
    }

    const touchEndX = event.touches[0].clientX;
    const touchEndY = event.touches[0].clientY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    // Determine the dominant direction of the swipe
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Swipe left or right
        direction = deltaX > 0 ? 'right' : 'left';
    } else {
        // Swipe up or down
        direction = deltaY > 0 ? 'down' : 'up';
    }

    // Reset touch start coordinates
    touchStartX = null;
    touchStartY = null;
}


function handleKeyPress(event) {
    if ((!gameStarted && (event.code === 'Space' || event.key === ' ')) || (!gameStarted && event.touches)) {
        startGame();
    } else {
        switch (event.key || getSwipeDirection(event)) {
            case 'ArrowUp':
                direction = 'up';
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowRight':
                direction = 'right';
                break;
            case 'ArrowLeft':
                direction = 'left';
                break;
        }
    }
}

// Helper function to determine swipe direction based on touch event
function getSwipeDirection(event) {
    const deltaX = event.touches[0].clientX - touchStartX;
    const deltaY = event.touches[0].clientY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        return deltaX > 0 ? 'right' : 'left';
    } else {
        return deltaY > 0 ? 'down' : 'up';
    }
}



// Add this code after defining other variables and elements
const startButton = document.getElementById('startButton');
startButton.addEventListener('click', startGame);

// Modify the existing startGame function to remove the automatic game start
function startGame() {
    gameStarted = true;
    instructiontext.style.display = 'none';
    logo.style.display = 'none';
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

// Remove the automatic game start from the initialization
// gameInterval = setInterval(() => {
//     move();
//     checkCollision();
//     draw();
// }, gameSpeedDelay);






const difficultySelect = document.getElementById('difficulty');
let difficulty = 'medium'; // Default difficulty

// ... (existing code)

// Function to set the game speed based on difficulty
function setGameSpeed() {
    switch (difficulty) {
        case 'easy':
            gameSpeedDelay = 300;
            break;
        case 'medium':
            gameSpeedDelay = 200;
            break;
        case 'hard':
            gameSpeedDelay = 100;
            break;
        // Add more cases for additional difficulty levels if needed
    }
}

// Event listener for difficulty change
difficultySelect.addEventListener('change', (event) => {
    difficulty = event.target.value;
    setGameSpeed();
});

// Modify the existing increaseSpeed function
function increaseSpeed() {
    // Your existing speed increase logic

    // Add this line to update the game speed based on difficulty
    setGameSpeed();
}

// ... (existing code)

// Call setGameSpeed initially to set the default speed
setGameSpeed();
