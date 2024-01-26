const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const players = document.getElementsByClassName("players");

let raf;
let running = false;
let playerObjects = [];
let numberOfPlayers = 20;

const playerConstants = {
    width: 30,
    height: 30
}

const imgPaper = document.getElementById("paper");
imgPaper.width = playerConstants.width;
imgPaper.height = playerConstants.height;
imgPaper.alt = "paper";

const imgRock = document.getElementById("rock");
imgRock.width = playerConstants.width;
imgRock.height = playerConstants.height;
imgRock.alt = "rock";

const imgScissors = document.getElementById("scissors");
imgScissors.width = playerConstants.width;
imgScissors.height = playerConstants.height;
imgScissors.alt = "scissors";

const images = [imgPaper, imgRock, imgScissors]

class Player {
    constructor(x, y) {
        // this.x = Math.floor(Math.random()*(canvas.width*0.9))+1;
        // this.y = Math.floor(Math.random()*(canvas.height*0.9))+1;
        this.x = x;
        this.y = y;
        this.type = images[Math.floor(Math.random()*images.length)];
        this.vy = (Math.round(Math.random()*1+0.5*100)/100) *(Math.random() < 0.5 ? -1 : 1);
        this.vx = (Math.round((Math.random()*2+0.5)*100/100)*(Math.random() < 0.5 ? -1 : 1));
    }
    draw(){
        ctx.drawImage(this.type, this.x, this.y, playerConstants.width, playerConstants.height);
    }
    randomizeVelocities(){
        this.vy = (Math.round(Math.random()*10+2*100)/100) *(Math.random() < 0.5 ? -1 : 1);
        this.vx = (Math.round((Math.random()*10+3*100)/100)*(Math.random() < 0.5 ? -1 : 1));
    }
}

function returnTwoRandomNumbers(){
    let x = Math.floor(Math.random()*(canvas.width*0.9))+1;
    let y = Math.floor(Math.random()*(canvas.height*0.9))+1;
    return {x, y}
}

function clear() {
    ctx.fillStyle = "rgba(38, 35, 35)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function draw() {
    if (new Set(playerObjects.map( x => x.type.alt)).size == 1){
        window.cancelAnimationFrame(raf);
        console.log("GEWINNER"); 
    }
    clear();
    playerObjects.forEach((player, index) => {
        for (i=0; i<playerObjects.length; i++){
            if (i === index) {
                continue;
            }
            if (checkCollision(player, playerObjects[i])){
                player.vy = -player.vy;
                player.vx = -player.vx;
                if (player.type === imgRock && playerObjects[i].type === imgRock){
                    continue;
                } else if (player.type === imgRock && playerObjects[i].type === imgScissors){
                    playerObjects[i].type = imgRock;
                } else if (player.type === imgRock && playerObjects[i].type === imgPaper){
                    player.type = imgPaper;
                } else if (player.type === imgPaper && playerObjects[i].type === imgPaper){
                    continue;
                } else if (player.type === imgPaper && playerObjects[i].type === imgRock){
                    playerObjects[i].type = imgPaper;
                } else if (player.type === imgPaper && playerObjects[i].type === imgScissors){
                    player.type = imgScissors;
                } else if (player.type === imgScissors && playerObjects[i].type === imgRock){
                    player.type = imgRock;
                } else if (player.type === imgScissors && playerObjects[i].type === imgPaper){
                    playerObjects[i].type = imgScissors;
                } else if (player.type === imgScissors && playerObjects[i].type === imgScissors){
                    continue;
                }
            }
        }
        if (checkYOutOfGame(player)) {
            player.vy = -player.vy;
        }
        if (checkXOutOfGame(player)) {
            player.vx = -player.vx;
        }

        player.x += player.vx;
        player.y += player.vy;
        
        player.draw();

        // player.randomizeVelocities();
        
    });
    raf = window.requestAnimationFrame(draw);
}

// Collison Check Functions

function checkYOutOfGame(object){
    if(object.y + playerConstants.height + object.vy > canvas.height || object.y + object.vy < 0){
        return true
    }
}

function checkXOutOfGame(object){
    if(object.x + playerConstants.width + object.vx > canvas.width || object.x + object.vx < 0){
        return true
    }
}

function checkCollision(object1, object2) {
    if (
    object1.x < object2.x + playerConstants.width &&
    object1.x + playerConstants.width > object2.x &&
    object1.y < object2.y + playerConstants.height &&
    object1.y + playerConstants.height > object2.y
    ) {
        return true
    }
}

window.addEventListener("keydown", (e) => {
    if (e.key === " "){
        startGame();
    }
})

function startGame() {
    if (!running) {
        raf = window.requestAnimationFrame(draw);
        running = true;
    }
};

function isNumberBetween(x, min, max) {
    return x >= min && x <= max;
}

// Create all Players
for (i=0;i<numberOfPlayers;i++){
    playerObjects.push(new Player(returnTwoRandomNumbers().x,returnTwoRandomNumbers().y));
}

clear();

// Draw the players when the Game Starts Up
playerObjects.forEach(player => {
    player.draw();
});