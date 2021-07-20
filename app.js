var canvas = document.querySelector("canvas");
var game = canvas.getContext("2d");


var character = {
  health:75,
  x:0,
  y:0,
  attack:10,
  defense:5,
  xspeed:0,
  yspeed:0,
  status:'poisoned',
  height:50,
  width:20,
  attacking: false,
  attackHit: false,
  jumpCount:0,
  specialMoves:[
    {
      name:'fireball',
      attack:20,
      type:'magic',
      element:'fire'
    }
  ],
  weapon:{
    x:0,
    y:0
  }
}

var enemy = {
  health:50,
  x:200,
  y:0,
  attack:5,
  defense:0,
  xspeed:0,
  yspeed:0,
  height:50,
  width:20,
  jumpCount:0
}



var gravity = 1;
var ground = canvas.height - character.height;
var level = 0;
var itemCount = 15;
var gameState = true;
var startTime = Date.now() + 3000;
var score = 0;
var health = 3;


var obstacleArray = []
var displayedObjects = []


var background = new Image();
background.src = "http://i.imgur.com/CpX4uAU.jpg";
background.onload = function(){
    game.drawImage(background,0,0,400,150);
}

var gameEnd = new Image();
gameEnd.src = "https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-323086.png"

var playerRight = new Image();
playerRight.src = "https://raw.githubusercontent.com/mikeplott/TOAdventure/master/public/avatars/elf-standing.png";
var imageRatio = 1;
playerRight.onload = function() {
  imageRatio = playerRight.width / playerRight.height;
}
var playerLeft = new Image();
playerLeft.src = "https://raw.githubusercontent.com/mikeplott/TOAdventure/master/public/avatars/elf-standing.png";

var playerJump = new Image();
playerJump.src = "https://raw.githubusercontent.com/mikeplott/TOAdventure/master/public/avatars/elf-jumping.png";

var playerDeath = new Image();
playerDeath.src = "https://raw.githubusercontent.com/mikeplott/TOAdventure/master/public/avatars/elf-death.png"

var playerImage = playerRight;

var enemyImage = playerRight;

var fullHealth = new Image();
fullHealth.src = "https://raw.githubusercontent.com/mikeplott/TOAdventure/master/public/ui/full-heart.png"


var emptyHealth = new Image();
emptyHealth.src = "https://raw.githubusercontent.com/mikeplott/TOAdventure/master/public/ui/empty-heart.png"


var backgroundMusic = new Audio();
backgroundMusic.src = "game-music.wav"
backgroundMusic.loop = true;

var playerJumpSound = new Audio();
playerJumpSound.src = "jump.wav"

var playerHurtSound = new Audio();
playerHurtSound.src = "player-hurt.wav"

var playerSplatSound = new Audio();
playerSplatSound.src = "player-splat.wav"

var enemySound = new Audio();
enemySound.src = "skull.wav"

var moneySound = new Audio();
moneySound.src = "coin.wav"

var itemSound = new Audio();
itemSound.src = "pickup-item.wav"

var gameOverSound = new Audio();
gameOverSound.src = "gameover.wav"


backgroundMusic.play()

function draw() {


  game.drawImage(background,0,0,canvas.width,canvas.height);
  game.font = "10px Arial";
  game.fillStyle = 'white';
  game.fillText("Enemy Health: " + enemy.health, 10, 10);
  game.fillText("Character Health: " + character.health, 10, 20);
  game.fillText("Character active status: " + character.status, 10, 30);
  handleCollisions()
  character.x = character.x + character.xspeed;
  character.y = character.y + character.yspeed;
  character.yspeed = character.yspeed + gravity;
  character.weapon.x = character.x + character.width
  character.weapon.y = character.y + (character.height/2)

  if (character.y > ground) {
    character.y = ground;
    character.yspeed = 0;
    character.jumpCount = 0;
    playerImage = playerRight
  }

  if (character.y < ground){
    playerImage = playerJump
  }

  if (character.x < 0){
    character.x = 0;
  }

  if (character.x > canvas.width - 30){
    character.x = canvas.width - 30;
  }
   if(score <= 0){
    score = 0;
  }

 if(health === 3){
   game.drawImage(fullHealth, 250, 2, 15, 15)
   game.drawImage(fullHealth, 265, 2, 15, 15)
   game.drawImage(fullHealth, 280, 2, 15, 15)
 } else if (health === 2){
   game.drawImage(fullHealth, 250, 2, 15, 15)
   game.drawImage(fullHealth, 265, 2, 15, 15)
   game.drawImage(emptyHealth, 280, 2, 15, 15)
 } else if (health === 1){
   game.drawImage(fullHealth, 250, 2, 15, 15)
   game.drawImage(emptyHealth, 265, 2, 15, 15)
   game.drawImage(emptyHealth, 280, 2, 15, 15)
 } else {
   game.drawImage(emptyHealth, 250, 2, 15, 15)
   game.drawImage(emptyHealth, 265, 2, 15, 15)
   game.drawImage(emptyHealth, 280, 2, 15, 15)


   endGame();
 }

 switch(character.status){
   case 'poisoned':
     character.health = character.health - 0.02
     break;
 }

 if(enemy.health <= 0){
  endGame();
 }

 game.fillStyle = "#ddd";
 game.fillRect(character.weapon.x, character.weapon.y, 30, 3);


  game.drawImage(playerImage, character.x, character.y, character.height * imageRatio, character.height);



  enemy.x = enemy.x + enemy.xspeed;
  enemy.y = enemy.y + enemy.yspeed;
  enemy.yspeed = enemy.yspeed + gravity;

  if (enemy.y > ground) {
    enemy.y = ground;
    enemy.yspeed = 0;
    enemy.jumpCount = 0;
    enemyImage = playerRight
  }

  if (enemy.y < ground){
    enemyImage = playerJump
  }

  game.drawImage(enemyImage, enemy.x, enemy.y, enemy.height * imageRatio, enemy.height);




  if(character.attacking &&  !character.attackHit){
    enemy.health = enemy.health - character.attack
    character.attackHit = true
  }
}

var gameUpdate = setInterval(draw, 20);

var endGame = function(){
   backgroundMusic.pause()
  game.drawImage(gameEnd, 5,30,300,100)
  // clearInterval(objectCycle);
  clearInterval(gameUpdate);
  playerHurtSound.play()
  setTimeout(function(){
     playerHurtSound.play()
     gameOverSound.play()
    enemy.y += -15;
    var fallingDeath = setInterval(function(){

    enemyImage = playerDeath;  game.drawImage(background,0,0,canvas.width,canvas.height);
  game.font = "10px Arial";
  game.fillStyle = 'white';
  game.fillText("Level: " + level, 10, 10);
  game.fillText("Score: " + score, 10, 20);
  enemy.x = enemy.x;
  enemy.y = enemy.y + enemy.yspeed;
  enemy.yspeed = enemy.yspeed + gravity;
    game.drawImage(enemyImage, enemy.x, enemy.y, enemy.height * imageRatio, enemy.height)
    game.drawImage(gameEnd, 5,30,300,100)
    if(enemy.y > ground){
      enemy.y = ground;
      enemy.yspeed = 0;
      playerSplatSound.play()
      clearInterval(fallingDeath)
    }
},45)
  }, 800)
}

function startMove(event) {
  // pressed left
  if (event.keyCode == 37) {
    character.xspeed = -5;
    playerImage = playerLeft;
  }
  // pressed right
  if (event.keyCode == 39) {
    character.xspeed = 5;
    playerImage = playerRight;
  }
  // pressed up
  if (event.keyCode == 38) {
    if (character.jumpCount < 2){
      playerJumpSound.load()
      playerJumpSound.play()
        character.yspeed = -10;
        character.jumpCount += 1;
        playerImage = playerJump;
        }
  }
  // pressed spacebar
  if(event.keyCode == 32){
    attack()
  }
}

document.onkeydown = startMove;

function stopMove(event) {
  if (event.keyCode == 37 || event.keyCode == 39) {
    character.xspeed = 0;
  }
}

document.onkeyup = stopMove;


var attack = function(){
  if(!character.attacking){
    character.attacking = true
    setTimeout(function(){
      character.attacking = false
      character.attackHit = false
    },1000)
   
  }
}


var collision = function (enemy, me){

  if(enemy.x < me.x + me.height * imageRatio &&
     enemy.x + enemy.width > me.x &&
     enemy.y < me.y + me.height &&
     enemy.y + enemy.height > me.y){
    return true
  }

}

var handleCollisions = function (){
  if(collision(enemy,character)){
    if(character.xspeed > 0){
      character.xspeed = 0
    }
  }
}


var handleAttackCollision = function (){
  if(collision(enemy,character.weapon)){
    if(!character.attackHit){
      enemy.health = enemy.health - character.attack
     
    }
  }
}


