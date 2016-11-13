var canvas = document.querySelector("canvas");
var game = canvas.getContext("2d");
var x = 0;
var y = 0;
var xspeed = 0;
var yspeed = 0;
var gravity = 1;
var height = 50;
var ground = canvas.height - height;
var jumpCount = 0;
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
  game.fillText("Level: " + level, 10, 10);
  game.fillText("Score: " + score, 10, 20);
  x = x + xspeed;
  y = y + yspeed;
  yspeed = yspeed + gravity;

  if (y > ground) {
    y = ground;
    yspeed = 0;
    jumpCount = 0;
    playerImage = playerRight
  }
  if (x < 0){
    x = 0;
  }

  if (y < ground){
     playerImage = playerJump
 }

  if (x > canvas.width - 30){
    x = canvas.width - 30;
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




  if (obstacleArray.length === 0){

    itemCount = itemCount + 5
    for (i = 0; i < itemCount ; i++){

      obstacleArray.push({
        x: 0,
        catName: "item",
        y: 0
     },
     {
      catName: "money",
      x: 0,
      y: 0
   },
   {
     catName: "enemy",
     x: 0,
     y: 0
  }
   // {
   //   catName: "health",
   //   x: 903,
   //   y: theY3
   // }
   )
    }
  }

  if(score <= 0){
    score = 0;
  }

  displayedObjects.forEach(function(item) {
    item.draw();
  });
  displayedObjects.forEach(function(item) {
    item.update();
  });
  displayedObjects = displayedObjects.filter(function(item) {
    return item.active;
  });

  handleCollisions();


  game.drawImage(playerImage, x, y, height * imageRatio, height);
}

var gameUpdate = setInterval(draw, 20);

var endGame = function(){
   backgroundMusic.pause()
  game.drawImage(gameEnd, 5,30,300,100)
  clearInterval(objectCycle);
  clearInterval(gameUpdate);
  playerHurtSound.play()
  setTimeout(function(){
     playerHurtSound.play()
     gameOverSound.play()
    y += -15;
    var fallingDeath = setInterval(function(){

    playerImage = playerDeath;  game.drawImage(background,0,0,canvas.width,canvas.height);
  game.font = "10px Arial";
  game.fillStyle = 'white';
  game.fillText("Level: " + level, 10, 10);
  game.fillText("Score: " + score, 10, 20);
    x = x;
    y = y + yspeed;
    yspeed = yspeed + gravity;
    game.drawImage(playerImage, x, y, height * imageRatio, height)
    game.drawImage(gameEnd, 5,30,300,100)
    if(y > ground){
      y = ground;
      yspeed = 0;
      playerSplatSound.play()
      clearInterval(fallingDeath)
    }
},45)



  }, 800)
}

function startMove(event) {
  // pressed left
  if (event.keyCode == 37) {
    xspeed = -5;
    playerImage = playerLeft;
  }
  // pressed right
  if (event.keyCode == 39) {
    xspeed = 5;
    playerImage = playerRight;
  }
  // pressed up
  if (event.keyCode == 38) {
    if (jumpCount < 2){
      playerJumpSound.load()
      playerJumpSound.play()
        yspeed = -10;
        jumpCount += 1;
        playerImage = playerJump;
        }
  }
}



var obstacle = function (O) {

   O.active = true;
   O.item = new Image()

   if(O.name === 'money'){
      O.item.src ="https://raw.githubusercontent.com/mikeplott/TOAdventure/master/public/money/money.png"
   } else if (O.name === 'item'){
      O.item.src ="https://raw.githubusercontent.com/mikeplott/TOAdventure/master/public/items/trident.png"
   } else if (O.name === 'enemy'){
      O.item.src = "https://raw.githubusercontent.com/mikeplott/TOAdventure/master/public/npcs/enemy1.png"
   } else if (O.name === 'health'){
      O.item.src = "https://raw.githubusercontent.com/mikeplott/TOAdventure/master/public/ui/full-heart.png"
   }

  O.xVelocity = 0;
  O.yVelocity = 0;
  O.width = 20;
  O.height = 20;
  O.color = "#FFF";

  O.inBounds = function() {
    if(O.y >= 0){
      return false
    }
  }

  O.draw = function() {
    game.drawImage(this.item,this.x, this.y, this.width, this.height)
    // game.fillStyle = this.color;
    // game.fillRect(this.x, this.y, this.width, this.height);
  };

  O.update = function() {
    O.x += -3;
    O.y += 0;

    if(O.x === 120){
      if(O.name === "enemy"){
         enemySound.play()
      }
   }

    if(O.x <= 0){
      score += 1;
      O.active = false

    } else {
      O.active = O.active
    }


  };

  return O;

}



var objectThrowing = function(){
   var itemTracks = [25,50,75,100,125]
   var xTracks = [900,920,950]
  if(Date.now() > startTime){

   if(displayedObjects.length === 0){
    level += 1;
  }

  var objAmount = (Math.floor(Math.random() * 3) + 1)
  if (objAmount > obstacleArray.length){
     objAmount = obstacleArray.length
 }

   for(var b = 0; b < objAmount; b++ ){
      var crntXIndex = (Math.floor(Math.random() * xTracks.length))
      var crntIndex = (Math.floor(Math.random() * itemTracks.length))
      var crntY = itemTracks[crntIndex]
      var crntX = xTracks[crntXIndex]
      var crntItem = obstacleArray[0]
      displayedObjects.push(obstacle({
        speed: -10,
        name: crntItem.catName,
        x: crntX,
        y: crntY
      }));
      itemTracks.splice(crntIndex, 1)
     obstacleArray.splice(0,1)
   }

  if(obstacleArray.length === 0){

    startTime = Date.now() + 10000
  }
  console.log(obstacleArray.length)
}


}

var objectCycle = setInterval(objectThrowing, 900)

var collision = function (item, me){

  if(item.x < x + height * imageRatio &&
     item.x + item.width > x &&
     item.y < y + height &&
     item.y + item.height > y){
    return true
  }

}

var handleCollisions = function (){
  displayedObjects.forEach(function(item){
    if(collision(item)){
      if(item.name === "enemy"){
         item.active = false
         score += -5;
         if(health > 0){
           health += -1;
           playerHurtSound.play()

         }
      } else if (item.name === "item"){
         itemSound.play()
         item.active = false
         score += 5;
      } else if (item.name === "money"){
         moneySound.play()
         item.active = false
         score += 10;
      } else if (item.name === "health"){
         item.active = false
         itemSound.play()
         health += 1;
         if(health > 3){
            health = 3;
         }
      }

    }
  })
}


document.onkeydown = startMove;

function stopMove(event) {
  if (event.keyCode == 37 || event.keyCode == 39) {
    xspeed = 0;
  }
}

document.onkeyup = stopMove;
