let board;
let boardWidth = 540;
let boardHeight = 960;
let context;

let birdWidth = 51;
let birdHeight = 36;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
}

let pipeArray = [];
let pipeWidth = 96;
let pipeHeight = 768;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

let velocityX = -2;
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;
let gameStarted = false;

let backgroundMusic;
let jumpSound;
let gameOverSound;

let isOnline = navigator.onLine;

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    birdImg = new Image();
    birdImg.src = "./images.png";
    birdImg.onload = function () {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    backgroundMusic = document.getElementById("backgroundMusic");
    jumpSound = document.getElementById("jumpSound");
    gameOverSound = document.getElementById("gameOverSound");

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    updateOnlineStatus();

    requestAnimationFrame(update);
    setInterval(placePipes, 1500);
    document.addEventListener("keydown", moveBird);
    document.getElementById("startButton").addEventListener("click", startGame);
    document.getElementById("restartButton").addEventListener("click", restartGame);
}

function update() {
    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);

    if (!isOnline) {
        document.getElementById("offlineScreen").style.display = "flex";
        return;
    } else {
        document.getElementById("offlineScreen").style.display = "none";
    }

    if (!gameStarted) {
        return;
    }

    if (gameOver) {
        document.getElementById("gameOverScreen").style.display = "flex";
        document.getElementById("finalScore").innerText = "Your Score: " + score;
        return;
    }

    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameOver = true;
        gameOverSound.play();
        backgroundMusic.pause();
    }

    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            gameOver = true;
            gameOverSound.play();
            backgroundMusic.pause();
        }
    }

    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();
    }

    context.fillStyle = "white";
    context.font = "67px sans-serif";
    context.fillText(score, 5, 67);

    document.getElementById("gameOverScreen").style.display = "none";
}

function placePipes() {
    if (gameOver || !gameStarted || !isOnline) {
        return;
    }

    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = board.height / 4;

    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    if (!isOnline) {
        return;
    }

    if (!gameStarted) {
        startGame();
        return;
    }

    if (gameOver) {
        restartGame();
        return;
    }

    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        velocityY = -6;
        jumpSound.play();
    }
}

function startGame() {
    if (!gameStarted && isOnline) {
        gameStarted = true;
        document.getElementById("startScreen").style.display = "none";
        backgroundMusic.play();
    }
}

function restartGame() {
    if (!isOnline) {
        return;
    }
    bird.y = birdY;
    pipeArray = [];
    score = 0;
    gameOver = false;
    velocityY = 0;
    document.getElementById("gameOverScreen").style.display = "none";
    backgroundMusic.play();
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}

function updateOnlineStatus() {
    isOnline = navigator.onLine;
    if (!isOnline) {
        backgroundMusic.pause();
        document.getElementById("offlineScreen").style.display = "flex";
    } else {
        document.getElementById("offlineScreen").style.display = "none";
    }
}