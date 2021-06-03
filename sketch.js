//3 June 2021
//..
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1png, obstacle2png, obstacle3png, obstacle4png, obstacle5png, obstacle6png;
var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound;
var lastFrameCount=0;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");
  obstacle1png = loadImage("obstacle1.png");
  obstacle2png = loadImage("obstacle2.png");
  obstacle3png = loadImage("obstacle3.png");
  obstacle4png = loadImage("obstacle4.png");
  obstacle5png = loadImage("obstacle5.png");
  obstacle6png = loadImage("obstacle6.png");
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  trex.scale = 0.5;
  
  ground = createSprite(1670/2,180,1670,20);
  ground.addImage("ground",groundImage);
  
  gameOver = createSprite(0,75);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  
  restart = createSprite(0,115);
  restart.addImage(restartImg);
  restart.scale = 0.5;
  
  invisibleGround = createSprite(1670/2,190,1670,10);
  invisibleGround.visible = false;
  
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  score = 0;
}

function draw() {
  background(255);
  frameRate(30);

  gameOver.x = trex.x;
  restart.x = trex.x;
  trex.velocityX = 6 + 3* score/100;
  camera.position.x = trex.x;
  //displaying score
  text("Score: "+ score, trex.x+230,50);
  
  
  if(gameState === PLAY){
    gameOver.visible = false;
    restart.visible = false;
    //scoring
    score = frameCount - lastFrameCount;
    if(trex.x>1600){trex.x = 50}
    if(score>0 && score%100 === 0){checkPointSound.play();}
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 100) {
      trex.velocityY = -12;
      jumpSound.play();
    }
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
    spawnClouds();
    spawnObstacles();
    if(obstaclesGroup.isTouching(trex)){
      //trex.velocityY = -12;
      jumpSound.play();
      gameState = END;
      dieSound.play();
    }

    
  } else if (gameState === END) {
  gameOver.visible = true;
  restart.visible = true;
  trex.velocityX = 0;
  
  //change the trex animation
  trex.changeAnimation("collided", trex_collided);
  trex.velocityY = 0
  
  //set lifetime of the clouds so that they are never destroyed
  cloudsGroup.setLifetimeEach(-1);
  cloudsGroup.setVelocityXEach(0);    
  }
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  if(mousePressedOver(restart)&&gameState===END){
    lastFrameCount = frameCount;
    reset();
  }
  
  drawSprites();
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score = 0;
  trex.changeAnimation("running",trex_running);
  trex.x = 50;
  trex.y = 160;
}


function spawnObstacles(){
  var obstacle1 = createSprite(400,165,10,40);
  obstacle1.scale = 0.5;
  obstacle1.addImage(obstacle4png);
  obstaclesGroup.add(obstacle1);

  var obstacle2 = createSprite(700,165,10,40);
  obstacle2.scale = 0.5;
  obstacle2.addImage(obstacle1png);
  obstaclesGroup.add(obstacle2);

  var obstacle3 = createSprite(980,165,10,40);
  obstacle3.scale = 0.5;
  obstacle3.addImage(obstacle3png);
  obstaclesGroup.add(obstacle3);

  var obstacle4 = createSprite(1200,165,10,40);
  obstacle4.scale = 0.5;
  obstacle4.addImage(obstacle6png);
  obstaclesGroup.add(obstacle4);

  var obstacle5 = createSprite(1390,165,10,40);
  obstacle5.scale = 0.5;
  obstacle5.addImage(obstacle2png);
  obstaclesGroup.add(obstacle5);
  
  var obstacle6 = createSprite(1650,165,10,40);
  obstacle6.scale = 0.5;
  obstacle6.addImage(obstacle5png);
  obstaclesGroup.add(obstacle6);

  var obstacle7 = createSprite(10,165,10,40);
  obstacle7.scale = 0.5;
  obstacle7.addImage(obstacle1png);
  obstaclesGroup.add(obstacle7);
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(trex.x+550,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

// Pramod Prasad Singh
//WHJR