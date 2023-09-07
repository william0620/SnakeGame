const GRID_SIZE = 30;
const GAME_SPEED = 10;
const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("high-score");
const gameBoard = document.getElementById("game-board");

const snakeBody = [
  { x: 15, y: 16 },
  { x: 15, y: 15 },
  { x: 15, y: 14 },
];

let food = {
  x: 4,
  y: 13,
};

let inputDirection = {
  x: 0,
  y: 1,
};

let lastInputDirection = {
  x: 0,
  y: 1,
};

let score = 0;

// Getting high score from the local storage
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

const main = () => {
  update();
  draw();
};

//Updating and drawing in every {1000/GAME_SPEED}ms
const intervalId = setInterval(main, 1000 / GAME_SPEED);

//Updating snake and food elements
const update = () => {
  updateSnake();
  updateFood();
};

//Drawing gameboard, snake and food
const draw = () => {
  gameBoard.innerHTML = "";
  drawSnake();
  drawFood();
};

const drawSnake = () => {
  for (let i = 0; i < snakeBody.length; i++) {
    // Creating a div for each part of the snake's body
    const snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = snakeBody[i].y;
    snakeElement.style.gridColumnStart = snakeBody[i].x;
    snakeElement.classList.add("snake");

    // Adding in the gameboard
    gameBoard.appendChild(snakeElement);
  }
};

const updateSnake = () => {
  snakeBody.pop(); // Removing tail of snake

  // Adding new head to the snake
  let newHead = { x: 0, y: 0 };
  newHead.x = snakeBody[0].x + getInputDirection().x;
  newHead.y = snakeBody[0].y + getInputDirection().y;
  snakeBody.unshift(newHead);

  // Checking if the snake head hit the body or bounds, if so end the game
  if (snakeOutOfBounds() || snakeIntersection()) {
    alert("Game Over!!!");
    clearInterval(intervalId);
    location.reload();
  }
};

const drawFood = () => {
  // Creating a div for food
  const foodElement = document.createElement("div");
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add("food");

  // Adding in the gameboard
  gameBoard.appendChild(foodElement);
};

const updateFood = () => {
  // Checking if snake head hit the food, if so grow snake and make a new food position
  if (onSnake(food)) {
    growSnake();
    food = getNewFoodPosition();
  }
};

window.addEventListener("keydown", (event) => {
  // Changing the direction value of snake on key press
  if (event.key === "ArrowUp" && lastInputDirection.x !== 0) {
    inputDirection = { x: 0, y: -1 };
  } else if (event.key === "ArrowDown" && lastInputDirection.x !== 0) {
    inputDirection = { x: 0, y: 1 };
  } else if (event.key === "ArrowRight" && lastInputDirection.y !== 0) {
    inputDirection = { x: 1, y: 0 };
  } else if (event.key === "ArrowLeft" && lastInputDirection.y !== 0) {
    inputDirection = { x: -1, y: 0 };
  }
});

const getInputDirection = () => {
  lastInputDirection = inputDirection; // Preventing snake from going back of its direction
  return inputDirection;
};

const onSnake = (foodPos) => {
  // Checking if {foodPos} is on snake body, if so return true
  for (let i = 0; i < snakeBody.length; i++) {
    if (equalPositions(foodPos, snakeBody[i])) {
      return true;
    }
  }
  // if not return false
  return false;
};

const growSnake = () => {
  snakeBody.push({ ...snakeBody[snakeBody.length - 1] }); // Duplicate last position of snakeBody array
  score++; // increment score by 1
  highScore = score >= highScore ? score : highScore;
  localStorage.setItem("high-score", highScore);
  scoreElement.innerText = `Score: ${score}`;
  highScoreElement.innerText = `High Score: ${highScore}`;
};

const equalPositions = (pos1, pos2) => {
  return pos1.x === pos2.x && pos1.y === pos2.y;
};

const getRandomPosition = () => {
  // Passing a random 1 - GRID_SIZE value as new position
  const randomX = Math.floor(Math.random() * GRID_SIZE + 1);
  const randomY = Math.floor(Math.random() * GRID_SIZE + 1);
  return { x: randomX, y: randomY };
};

const getNewFoodPosition = () => {
  let newFoodPosition = getRandomPosition();
  // Getting a random position out of snake body as food position
  while (onSnake(newFoodPosition)) {
    newFoodPosition = getRandomPosition();
  }
  return newFoodPosition;
};

const outOfBounds = (pos) => {
  return pos.x < 1 || pos.x > GRID_SIZE || pos.y < 1 || pos.y > GRID_SIZE;
};

const snakeOutOfBounds = () => {
  // Checking if the snake head hit the bounds, if so return true
  return outOfBounds(snakeBody[0]);
};

const snakeIntersection = () => {
  // Checking if the snake head hit the body, if so return true
  for (let i = 1; i < snakeBody.length; i++) {
    if (equalPositions(snakeBody[0], snakeBody[i])) return true;
  }
  return false;
};
