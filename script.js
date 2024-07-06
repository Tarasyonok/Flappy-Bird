let cvs = document.querySelector(`#canvas`);
cvs.width = window.innerWidth;
cvs.height = window.innerHeight;

let ctx = cvs.getContext(`2d`);

let bird = new Image();
let birds = [0, 1, 2];
birds[0] = new Image()
birds[0].src = `images/bird1.png`;
birds[1] = new Image()
birds[1].src = `images/bird2.png`;
birds[2] = new Image()
birds[2].src = `images/bird3.png`;
let bgImg = new Image();
let groundImg = new Image();
let topPipeImg = new Image();
let bottomPipeImg = new Image();
bird.src = `images/bird1.png`;
bgImg.src = `images/bg.png`;
groundImg.src = `images/ground.png`;
topPipeImg.src = `images/pipe2.png`;
bottomPipeImg.src = `images/pipe3.png`;

let flap_sound = new Audio();
let score_sound = new Audio();
let smash_sound = new Audio();
let switch_sound = new Audio();

flap_sound.src = `audio/sound_flap.mp3`;
score_sound.src = `audio/sound_score.mp3`;
smash_sound.src = `audio/sound_smash.mp3`;
switch_sound.src = `audio/sound_switch.mp3`;

// let fly = new Audio();
// let score_audio = new Audio();
let gap = 200;
let gameSpeed = 15;
let currGame = 0;
let bestScoreNum = 0;
// let onPause = false;


games = [];
for (let i = 0; i < localStorage.length; i++) {
    if (localStorage.key(i).includes("tarasyonok")) {
        if (Number(localStorage.key(i).replace("tarasyonok", "")) > currGame) {
            currGame = Number(localStorage.key(i));
        }
        games.push(JSON.parse(localStorage.getItem(localStorage.key(i))));

    }
}
games.sort((a, b) => b.score - a.score);
games = games.slice(0, 10);
document.querySelector(".top-list ul").innerHTML = "";
for (let i = 0; i < games.length; i++) {
    if (games[i].score > bestScoreNum) {
        bestScoreNum = games[i].score;
    }
    if (games[i].score >= 20) {
        document.querySelector(".top-list ul").innerHTML += `<li><span>${games[i].name} <img src="images/platinum_medal.png"></span> <span>${games[i].score}</span></li>`;
    } else if (games[i].score >= 15) {
        document.querySelector(".top-list ul").innerHTML += `<li><span>${games[i].name} <img src="images/gold_medal.png"></span> <span>${games[i].score}</span></li>`;
    } else if (games[i].score >= 10) {
        document.querySelector(".top-list ul").innerHTML += `<li><span>${games[i].name} <img src="images/silver_medal.png"></span> <span>${games[i].score}</span></li>`;
    } else if (games[i].score >= 5) {
        document.querySelector(".top-list ul").innerHTML += `<li><span>${games[i].name} <img src="images/bronze_medal.png"></span> <span>${games[i].score}</span></li>`;
    } else {
        document.querySelector(".top-list ul").innerHTML += `<li><span>${games[i].name}</span> <span>${games[i].score}</span></li>`;
    }
}
if (games.length == 0) {
    document.querySelector(".top-list ul").innerHTML = "<li>No one published his score yet</li>";
}
currGame++;
if (!localStorage.getItem("Tarasyonokbest")) {
    localStorage.setItem("Tarasyonokbest", bestScoreNum);
} else {
    bestScoreNum = Number(localStorage.getItem("Tarasyonokbest"));
}



let startBtn = document.querySelector(`.start`);
let scoreBtn = document.querySelector(`.score`);
let okBtn = document.querySelector(`.ok`);
let publishBtn = document.querySelector(`.publish`);
let restartBtn = document.querySelector(`.restart`);
let tapToFlap = document.querySelector(`.tap-to-flap`);
let logo = document.querySelector(`.logo`);
let gameOver = document.querySelector(`.game-over`);
let gameInfo = document.querySelector(`.game-info`);
let currScoreTop = document.querySelector(`.curr-score-top`);
let currScore = document.querySelector(`.curr-score`);
let bestScore = document.querySelector(`.best-score`);
let topList = document.querySelector(`.top-list`);
let topListOverlay = document.querySelector(`.top-list-overlay`);
let closeTopList = document.querySelector(`.top-list svg`);
let publishScore = document.querySelector(`.publish-score`);
let input = document.querySelector(`.username input`);
let newScore = document.querySelector(`.new`);
let medal = document.querySelector(`.medal`);
// let playBtn = document.querySelector(`.play-btn`);
// let pauseBtn = document.querySelector(`.pause-btn`);
bestScore.innerHTML = bestScoreNum;

// playBtn.addEventListener(`click`, () => {
//     onPause = false;
//     playBtn.style.display = "none";
//     pauseBtn.style.display = "block";
// });

// pauseBtn.addEventListener(`click`, () => {
//     onPause = true;
//     pauseBtn.style.display = "none";
//     playBtn.style.display = "block";
// });


document.addEventListener(`keydown`, moveUp);
document.addEventListener(`mousedown`, (e) => {
    // if (e.composedPath().includes(playBtn) || e.composedPath().includes(pauseBtn)) {
    //     return;
    // }
    moveUp();
});

startBtn.addEventListener(`click`, () => {
    document.body.style.cursor = "pointer"
    mainPage = false;
    // startBtn.style.opacity = 0;
    startBtn.style.display = "none";
    // scoreBtn.style.opacity = 0;
    scoreBtn.style.display = "none";
    // logo.style.opacity = 0;
    logo.style.display = "none";
    // tapToFlap.style.opacity = 1;
    tapToFlap.style.display = "block";
    // currScoreTop.style.opacity = 1;
    currScoreTop.style.display = "block";
    // pauseBtn.style.display = "block";
    pipes = [
        {
            x: cvs.width,
            y: window.innerHeight * 0.3 - topPipeImg.height,
            isPassed: false,
            isNewGend: false,
        }
    ];

    birdX = window.innerWidth * 0.1;
    birdY = window.innerHeight * 0.4;
    birdVel = 0;
    isGameOver = false;
    isFlying = false;
    score = 0;
    currScoreTop.innerHTML = 0;

    switch_sound.currentTime = 0;
    switch_sound.play();
});

function moveUp() {
    if (!mainPage && !gameInfoPage) {
        isFlying = true;
        birdVel = -4;
        flap_sound.currentTime = 0;
        flap_sound.play();
        // tapToFlap.style.opacity = 0;
        tapToFlap.style.display = "none";
    }
}

let pipes = [
    {
        x: cvs.width,
        y: window.innerHeight * 0.3 - topPipeImg.height,
        isPassed: false,
        isNewGend: false,
    }
];

let score = 0
let isGameOver = false;
let isFlying = false;
let groundX = 0;
let mainPage = true;
let gameInfoPage = false;

let birdX = window.innerWidth * 0.1;
let birdY = window.innerHeight * 0.4;
let birdVel = 0;
let birdIndex = 1;
let birdIndexCounter = 0;


function draw() {

    requestAnimationFrame(draw);
    // if (onPause) {

    // } else {
    ctx.drawImage(bgImg, 0, -7000 + (window.innerHeight * 0.8));
    if (gameInfoPage) {
        for (let i = 0; i < pipes.length; i++) {
            ctx.drawImage(topPipeImg, pipes[i].x, pipes[i].y);
            ctx.drawImage(bottomPipeImg, pipes[i].x, pipes[i].y +
                topPipeImg.height + gap);
        }
        if (birdY >= window.innerHeight * 0.8) {
            birdY = window.innerHeight * 0.8
            birdVel += 30;
            if (birdVel >= 90) {
                birdVel = 90;
            }
            drawRotated(ctx, birds[0], birdX, birdY, birdVel);
        } else {
            drawRotated(ctx, birds[0], birdX, birdY, birdVel * 3);
            birdVel += 0.5;
            birdY += birdVel;
        }
    } else if (mainPage) {
    } else {

        if (isFlying) {
            groundX -= gameSpeed;
        }
        if (groundX < -105) {
            groundX = 0
        }

        if (pipes[0].x < 750) {
            gameSpeed = 3 + score / 4;
        } else {
            gameSpeed = 15;
        }

        if (isFlying) {
            birdVel += 0.2
            if (birdVel > 7) {
                birdVel = 7;
            }

            // ctx.setTransform(1, 0, 0, 1, birdX, birdY);
            // ctx.rotate(birdVel * -2);
            // ctx.drawImage(bird, -bird.width / 2, -bird.height / 2);
            let bird_top = birdY - 25;
            let bird_bottom = birdY - 25 + bird.height;
            let bird_left = birdX - 25;
            let bird_right = birdX - 25 + bird.width;

            new_pipes = [];
            for (let i = 0; i < pipes.length; i++) {
                pipes[i].x -= gameSpeed;
                ctx.drawImage(topPipeImg, pipes[i].x, pipes[i].y);
                ctx.drawImage(bottomPipeImg, pipes[i].x, pipes[i].y +
                    topPipeImg.height + gap);
                // ctx.strokeRect(pipes[i].x, pipes[i].y, topPipeImg.width, topPipeImg.height);
                // ctx.strokeRect(pipes[i].x, pipes[i].y + topPipeImg.height + gap, topPipeImg.width, topPipeImg.height);

                if (pipes[i].x < window.innerWidth - 300 && !pipes[i].isNewGend) {
                    pipes[i].isNewGend = true;
                    pipes.push({
                        x: cvs.width,
                        y: window.innerHeight * 0.3 - topPipeImg.height + Math.random() * (200) - 100,
                        isPassed: false,
                        isNewGend: false,
                    });
                }

                // if (birdX - 30 + bird.width >= pipes[i].x
                //     && birdX <= pipes[i].x + topPipeImg.width
                //     && (birdY - 25 <= pipes[i].y + topPipeImg.height
                //         || birdY - 30 + bird.height >= pipes[i].y + topPipeImg.height + gap)
                //     || birdY - 30 + bird.height >= window.innerHeight * 0.8) {
                //     console.log(`game over`);
                //     isGameOver = true;
                //     break
                // }

                if ((pipes[i].x <= bird_right
                    && pipes[i].x + topPipeImg.width >= bird_left)
                    && ((bird_top) <= (pipes[i].y + topPipeImg.height)
                        || ((bird_bottom) >= (pipes[i].y + topPipeImg.height + gap)))
                    || (bird_bottom >= window.innerHeight * 0.8)) {
                    // setTimeout(() => {
                    // console.log(`game over`);
                    isGameOver = true;
                    // }, 50);
                    // break
                }

                if (bird_left > pipes[i].x + topPipeImg.width && !pipes[i].isPassed) {
                    pipes[i].isPassed = true;
                    score++;
                    score_sound.currentTime = 0;
                    score_sound.play();
                    currScoreTop.innerHTML = score;
                }
                if (pipes[i].x > -topPipeImg.width) { // -topPipeImg.width
                    new_pipes.push(pipes[i]);
                }
            }
            pipes = new_pipes;
            if (isGameOver) {
                smash_sound.currentTime = 0;
                smash_sound.play();
                showGameInfo();
            }
        }

        birdY += birdVel;
        birdY += birdVel;
        drawRotated(ctx, birds[birdIndex], birdX, birdY, birdVel * 3);
        // ctx.strokeRect(birdX - 25, birdY - 25, bird.width, bird.height)
        // ctx.drawImage(obj, x, y, w, h)

        ctx.fillStyle = `#000`;
        ctx.font = `24px Verdana`;
        ctx.fillText(`Счет: ${score}`, 10, cvs.height - 20)
    }
    ctx.drawImage(groundImg, groundX, window.innerHeight * 0.8);

    // }
}

function drawRotated(context, image, imageX, imageY, degrees) {
    context.save();
    context.translate(imageX, imageY);
    context.rotate(0.017453292519943295 * degrees);  // 0.017453292519943295 == Math.PI / 180
    context.drawImage(image, -0.5 * image.width, -0.5 * image.width);
    context.restore();
}

function showGameInfo() {
    document.body.style.cursor = "auto"
    gameInfoPage = true;
    // gameOver.style.opacity = 1;
    // gameInfo.style.opacity = 1;
    gameOver.style.display = "block";
    gameInfo.style.display = "block";
    currScore.style.display = "block";
    bestScore.style.display = "block";
    okBtn.style.display = "block";
    publishBtn.style.display = "block";
    restartBtn.style.display = "block";
    currScore.innerHTML = score;

    if (score > bestScoreNum) {
        bestScoreNum = score;
        bestScore.innerHTML = bestScoreNum;
        localStorage.setItem("Tarasyonokbest", bestScoreNum);
        newScore.style.display = "block";
    }

    medal.style.display = "block";
    if (score >= 20) {
        medal.style.backgroundImage = "url(images/platinum_medal.png)";
    } else if (score >= 15) {
        medal.style.backgroundImage = "url(images/gold_medal.png)";
    } else if (score >= 10) {
        medal.style.backgroundImage = "url(images/silver_medal.png)";
    } else if (score >= 5) {
        medal.style.backgroundImage = "url(images/bronze_medal.png)";
    } else {
        medal.style.display = "none";
    }

}

okBtn.addEventListener(`click`, () => {
    gameInfoPage = false;
    mainPage = true;

    startBtn.style.display = "block";
    scoreBtn.style.display = "block";
    logo.style.display = "block";
    tapToFlap.style.display = "none";
    currScoreTop.style.display = "none";
    gameOver.style.display = "none";
    gameInfo.style.display = "none";
    currScore.style.display = "none";
    bestScore.style.display = "none";
    newScore.style.display = "none";
    medal.style.display = "none";
    okBtn.style.display = "none";
    publishBtn.style.display = "none";
    restartBtn.style.display = "none";
    topList.style.display = "none"
    topListOverlay.style.display = "none"

    pipes = [{
        x: cvs.width,
        y: window.innerHeight * 0.3 - topPipeImg.height,
        isPassed: false,
        isNewGend: false,
    }];
    switch_sound.currentTime = 0;
    switch_sound.play();
});

scoreBtn.addEventListener(`click`, () => {
    topList.style.display = "block";
    topListOverlay.style.display = "block";
    publishScore.style.display = "none";
    switch_sound.currentTime = 0;
    switch_sound.play();
});

publishBtn.addEventListener(`click`, () => {
    topList.style.display = "block";
    topListOverlay.style.display = "block";
    publishScore.style.display = "block";
    document.querySelector(".publish-score span").innerHTML = score;
    input.focus();
    switch_sound.currentTime = 0;
    switch_sound.play();
});

restartBtn.addEventListener(`click`, () => {
    okBtn.click();
    startBtn.click();
});

document.addEventListener(`keydown`, (e) => {
    if (publishScore.style.display == "block" && e.code == "Enter") {
        if (input.value) {
            localStorage.setItem("tarasyonok" + currGame, JSON.stringify({ name: input.value, score: score }));
            games = [];
            for (let i = 0; i < localStorage.length; i++) {
                if (localStorage.key(i).includes("tarasyonok")) {
                    games.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
                } 
            }
            games.sort((a, b) => b.score - a.score);
            games = games.slice(0, 10);
            document.querySelector(".top-list ul").innerHTML = "";
            for (let i = 0; i < games.length; i++) {
                if (games[i].score >= 20) {
                    document.querySelector(".top-list ul").innerHTML += `<li><span>${games[i].name} <img src="images/platinum_medal.png"></span> <span>${games[i].score}</span></li>`;
                } else if (games[i].score >= 15) {
                    document.querySelector(".top-list ul").innerHTML += `<li><span>${games[i].name} <img src="images/gold_medal.png"></span> <span>${games[i].score}</span></li>`;
                } else if (games[i].score >= 10) {
                    document.querySelector(".top-list ul").innerHTML += `<li><span>${games[i].name} <img src="images/silver_medal.png"></span> <span>${games[i].score}</span></li>`;
                } else if (games[i].score >= 5) {
                    document.querySelector(".top-list ul").innerHTML += `<li><span>${games[i].name} <img src="images/bronze_medal.png"></span> <span>${games[i].score}</span></li>`;
                } else {
                    document.querySelector(".top-list ul").innerHTML += `<li><span>${games[i].name}</span> <span>${games[i].score}</span></li>`;
                }
            }
            currGame++;
            publishScore.style.display = "none"
            okBtn.click();
            scoreBtn.click();
        }
    }
});

closeTopList.addEventListener(`click`, () => {
    topList.style.display = "none";
    topListOverlay.style.display = "none";
    publishScore.style.display = "none"
});

setInterval(() => {
    birdIndex++;
    if (birdIndex > 2) {
        birdIndex = 0;
    }
}, 150);

bottomPipeImg.onload = draw