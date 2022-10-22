const gameBoard = document.querySelector(".game-board");
const doodler = document.createElement("div");
const startTitle = document.createElement("p");
let doodlerLeftSpace = 50;
let startPoint = 115;
let doodlerBottomSpace = startPoint;
let isGameOver = false;
let platformCount = 5;
let platforms = [];
let upTimerId;
let downTimerId;
let leftTimerId;
let rightTimerId;
let isJumping = true;
let isGoingLeft = false;
let isGoingRight = false;
let score = 0;


function createDoodler() {
    gameBoard.appendChild(doodler);
    doodler.classList.add("doodler");
    doodlerLeftSpace = platforms[0].left;
    doodler.style.left = doodlerLeftSpace + "px";
    doodler.style.bottom = doodlerBottomSpace + "px";
    startTitle.classList.add("title");
    startTitle.textContent = "Press any button to start";
    gameBoard.appendChild(startTitle);
}

class Platform {
    constructor(newPlatformBottom) {
        this.bottom = newPlatformBottom;
        this.left = Math.random() * 315;
        this.visual = document.createElement("div");

        const visual = this.visual;
        visual.classList.add("platform");
        visual.style.left = this.left + "px";
        visual.style.bottom = this.bottom + "px";
        gameBoard.appendChild(visual);
    }
}

function createPlatforms() {
    for (let i = 0; i < platformCount; i++) {
        let platformGap = 600 / platformCount;
        let newPlatformBottom = 100 + (i * platformGap);
        let newPlatform = new Platform(newPlatformBottom);
        platforms.push(newPlatform);
    }
}

function movePlatforms() {
    if (doodlerBottomSpace > 200) {
        platforms.forEach((platform) => {
            platform.bottom -= 4;
            let visual = platform.visual;
            visual.style.bottom = platform.bottom + "px";
            if (platform.bottom < 10) {
                let firstPlatform = platforms[0].visual;
                firstPlatform.classList.remove("platform");
                platforms.shift();
                let newPlatform = new Platform(600);
                platforms.push(newPlatform);
            }
        });
    }
}

function jump() {
    score++;
    clearInterval(downTimerId);
    isJumping = true;
    upTimerId = setInterval(function () {
        doodlerBottomSpace += 20;
        doodler.style.bottom = doodlerBottomSpace + "px";
        if (doodlerBottomSpace > startPoint + 200) {
            fall();
        }
    }, 30);

}

function fall() {
    clearInterval(upTimerId);
    isJumping = false;
    downTimerId = setInterval(function () {
        doodlerBottomSpace -= 5;
        doodler.style.bottom = doodlerBottomSpace + "px";
        if (doodlerBottomSpace <= 0) {
            gameOver();
        }
        platforms.forEach(platform => {
            if ((doodlerBottomSpace >= platform.bottom) && (doodlerBottomSpace <= platform.bottom + 15) && ((doodlerLeftSpace + 60) >= platform.left) && (doodlerLeftSpace <= (platform.left + 85)) && !isJumping) {
                startPoint = doodlerBottomSpace;
                jump();
            }
        });
    }, 30);
}

function gameOver() {
    isGameOver = true;
    while (gameBoard.firstChild) {
        gameBoard.removeChild(gameBoard.firstChild);
    }

    gameBoard.innerHTML = "score " + score;
    gameBoard.insertAdjacentHTML("beforeend", `<button onclick=location.reload()>Retry!</button>`);
    clearInterval(upTimerId);
    clearInterval(downTimerId);
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);
}

function control(e) {
    switch (e.key) {
        case "ArrowDown":
            moveStraight();
            break;
        case "ArrowLeft":
            moveLeft();
            break;
        case "ArrowRight":
            moveRight();
            break;
    }
}

function moveLeft() {
    if (isGoingRight) {
        clearInterval(rightTimerId);
        isGoingRight = false;
    }
    if (isGoingLeft) {

    } else {
        isGoingLeft = true;
        leftTimerId = setInterval(function () {
            if (doodlerLeftSpace >= 0) {
                doodlerLeftSpace -= 5;
                doodler.style.left = doodlerLeftSpace + "px";
            } else {
                moveRight();
            }
        }, 30);
    }
}

function moveRight() {
    if (isGoingLeft) {
        clearInterval(leftTimerId);
        isGoingLeft = false;
    }
    if (isGoingRight) {

    } else {
        isGoingRight = true;
        rightTimerId = setInterval(function () {
            if (doodlerLeftSpace <= 340) {
                doodlerLeftSpace += 5;
                doodler.style.left = doodlerLeftSpace + "px";
            } else {
                moveLeft();
            }
        }, 30);
    }
}

function moveStraight() {
    isGoingLeft = false;
    isGoingRight = false;
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);
}

function start() {
    gameBoard.removeChild(startTitle);
    document.removeEventListener("keyup", start);
    document.addEventListener("keyup", control);

    if (!isGameOver) {
        setInterval(movePlatforms, 30);
        jump();
    }
}

createPlatforms();
createDoodler();


document.addEventListener("keyup", start);
