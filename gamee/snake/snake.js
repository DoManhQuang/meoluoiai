const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const blockSize = 10;
// leaderboard_data = [];
// const fs = require("fs");
// try {
//     leaderboard_data = JSON.parse(fs.readFileSync('leaderboard.json', 'utf-8'));
//   } catch (err) {
//     console.error(err);
// }

let snake = [{x: 20, y: 20}, {x: 10, y: 20}];

let food = {
    x: Math.floor(Math.random() * (canvas.width / blockSize)) * blockSize,
    y: Math.floor(Math.random() * (canvas.height / blockSize)) * blockSize
};
  
let score = 0; // initialize score to 0
let scoreDisplay = document.getElementById("score");
let dx = 10;
let dy = 0;

function drawScore(score) {
    scoreDisplay.innerText = "Score: " + score;
}

function drawSnake() {
  ctx.fillStyle = "yellow"; // change the color of the head
  ctx.fillRect(snake[0].x, snake[0].y, blockSize, blockSize); // fill head block
  ctx.fillStyle = "green"; // reset color to green for rest of the snake
  for (let i = 1; i < snake.length; i++) {
    ctx.fillRect(snake[i].x, snake[i].y, blockSize, blockSize);
  }
}

function moveSnake() {
  let head = {
    x: snake[0].x + dx, y: snake[0].y + dy
};
  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    food.x = Math.floor(Math.random() * (canvas.width / blockSize)) * blockSize;
    food.y = Math.floor(Math.random() * (canvas.height / blockSize)) * blockSize;
    score++; // increment score when snake catches a prey
    drawScore(score)
  } else {
    snake.pop();
  }
}

function drawFood() {
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, blockSize, blockSize);
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function checkCollision() {
  if (snake[0].x < 0 || snake[0].x >= canvas.width || 
      snake[0].y < 0 || snake[0].y >= canvas.height) {
    return true;
  }
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }
  return false;
}


function saveScore(){
    let saveScore = confirm("Game over! Your score: " + score + " Do you want to save your score?");
    if (saveScore) {
        let playerName = prompt("Please enter your name:");
        if (playerName) {
            let scoreData = {name: playerName, score: score};
            leaderboard_data.push(scoreData)
            // save the updated list to file.json
            fs.writeFileSync('leaderboard.json', JSON.stringify(leaderboard_data));
            alert("Save Done!");
        }
    }
}

function gameLoop() {
  if (checkCollision()) {
    clearInterval(intervalId);
    alert("Game Over!");
    // saveScore()
  } else {
    clearCanvas();
    drawSnake();
    drawFood();
    drawScore(score);
    moveSnake();
  }
}

document.addEventListener("keydown", function(event) {
  if (event.keyCode === 37 && dx !== blockSize) {
    dx = -blockSize;
    dy = 0;
  } else if (event.keyCode === 38 && dy !== blockSize) {
    dx = 0;
    dy = -blockSize;
  } else if (event.keyCode === 39 && dx !== -blockSize) {
    dx = blockSize;
    dy = 0;
  } else if (event.keyCode === 40 && dy !== -blockSize) {
    dx = 0;
    dy = blockSize;
  }
});

// let intervalId = setInterval(gameLoop, 100);


const startBtn = document.getElementById("start-btn");
const replayBtn = document.getElementById("replay-btn");
const endBtn = document.getElementById("end-btn");

startBtn.addEventListener("click", startGame);
replayBtn.addEventListener("click", replayGame);
endBtn.addEventListener("click", endGame);

function startGame() {
  intervalId = setInterval(gameLoop, 100);
  score = 0
  snake = [{x: 20, y: 20}, {x: 10, y: 20}];
  food = {
    x: Math.floor(Math.random() * (canvas.width / blockSize)) * blockSize,
    y: Math.floor(Math.random() * (canvas.height / blockSize)) * blockSize
    };
  startBtn.disabled = true;
  replayBtn.disabled = false;
  endBtn.disabled = false;
}

function replayGame() {
  clearInterval(intervalId);
  clearCanvas();
  score = 0
  snake = [{x: 20, y: 20}, {x: 10, y: 20}];
  food = {
    x: Math.floor(Math.random() * (canvas.width / blockSize)) * blockSize,
    y: Math.floor(Math.random() * (canvas.height / blockSize)) * blockSize
    };
  dx = 10;
  dy = 0;
  intervalId = setInterval(gameLoop, 100);
}

function endGame() {
  clearInterval(intervalId);
  clearCanvas();
  drawScore(0);
  startBtn.disabled = false;
  replayBtn.disabled = true;
  endBtn.disabled = true;
  alert("See you again!");
}

