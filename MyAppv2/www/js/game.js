//instance of our running game, holds the game
var game = new Phaser.Game(400, 650, Phaser.AUTO, 'game-dev');
//GLOBAL VARIABLES
var spacefield;
var backgroundVelocity;
var player;
var cursors;

var bullets;
var bulletTime = 0;
var fireButton;

var enemies;

var lives;
var score = 0;
var scoreText;
var winText;
var loseText;
var playButton;
var lives;
var explosions;


var mainState = {
	//runs before the game begins, useful for opening up images
	preload:function() {
	game.load.image('spaceBackground', '../media/images/background.png');
	game.load.image('player','../media/images/ship.png');
	game.load.image('player_lives','../media/images/ship_lives.png');
	game.load.image('bullet','../media/images/bullet.png');
	game.load.image('enemy', '../media/images/enemy.png');
	game.load.image('enemyBullet', '../media/images/enemy_bullet.png');
	game.load.image('button','../media/images/retry.png');
	game.load.spritesheet('kaboom', '../media/images/explosion.png', 128, 128);
	},
	//add elements to our game
	create:function() {
		spacefield=game.add.tileSprite(0,0,400,650,'spaceBackground');
		backgroundVelocity = 4;

		player =game.add.sprite(game.world.centerX-50, game.world.centerY+200, 'player');
		game.physics.enable(player, Phaser.Physics.ARCADE);
		cursors = game.input.keyboard.createCursorKeys();
		player.body.collideWorldBounds = true;

		bullets= game.add.group();
		bullets.enableBody = true;
		bullets.physicsBodyType = Phaser.Physics.ARCADE;
		bullets.createMultiple(30, 'bullet');
		bullets.setAll('anchor.x',0.5);
		bullets.setAll('anchor.y',1);
		bullets.setAll('outOfBoundsKill', true);
		bullets.setAll('checkWorldBounds', true);
		fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		
		
		enemies = game.add.group();
		enemies.enableBody = true;
		enemies.physicsBodyType = Phaser.Physics.ARCADE;
		
		createEnemies();
		

		scoreText = game.add.text(0,0, 'Score: ',{font: '32px Verdana',fill: '#fff' });
		
		winText = game.add.text(game.world.centerX-50, game.world.centerY-100, 'You Win!',{font: '32px Verdana',fill: '#B8860B'});
		winText.visible = false;

		loseText = game.add.text(game.world.centerX-100, game.world.centerY-100, 'You are dead!',{font: '32px Verdana',fill: '#ff0000'});
		loseText.visible = false;
		
		highscoreText= game.add.text(game.world.centerX-60, game.world.centerY-40, 'Score: ',{font: '32px Verdana',fill: '#fff' });
		highscoreText.visible= false;
		
		playButton = game.add.button(game.world.centerX-15, 350, 'button', actionOnClick, this, 2, 1, 0);
		playButton.visible = false;
		
		lives = game.add.group();
		game.add.text(game.world.width - 115, 0, 'Lives : ', { font: '32px Verdana', fill: '#fff' });
		for (var i = 0; i < 3; i++) 
    {
        var ship = lives.create(game.world.width - 100 + (30 * i), 60, 'player_lives');
        ship.anchor.setTo(0.5, 0.5);
        ship.angle = 90;
        ship.alpha = 0.4;
    }
		
	//  An explosion pool
		explosions = game.add.group();
		explosions.createMultiple(30, 'kaboom');
		explosions.forEach(setupEnemy, this);
	},
	//conditions to check for every frame
	update:function(){
		game.physics.arcade.overlap(bullets, enemies, collisionHandler, null, this);

		game.physics.arcade.overlap(player, enemies, playerHandler, null, this);

		spacefield.tilePosition.y += backgroundVelocity;
		if(cursors.left.isDown)
		{
			player.body.velocity.x = -150;
		}
		if(cursors.right.isDown)
		{
			player.body.velocity.x = 150;
		}
		if(fireButton.isDown){
			fireBullet();
		}
	}
}

function fireBullet() {
	if(game.time.now > bulletTime){
		bullet = bullets.getFirstExists(false);
	}
	if(bullet) {
		bullet.reset(player.x+30,player.y);
		bullet.body.velocity.y = -400;
		bulletTime = game.time.now + 200;
	}
	scoreText.text ='Score: ' + score;
	checkWin(score);
}

//checks the to see if the player has destroyed all enemies
function checkWin(score){
	if(score == 3200){
		winText.visible = true;
		scoreText.visible = false;
		playButton.visible= true
		highscoreText.text ='Score: ' + score;
		highscoreText.visible = true;
	}
}
//this will organize all of the enemies on the screen
function createEnemies() {
	for ( var y = 0 ; y< 4; y++){
		for( var x = 0 ; x< 8 ; x++){
			var enemy = enemies.create(x*35, y*60,'enemy');
			/*Where to position each enemy on the screen */
			enemy.anchor.setTo(2,0.5);
		}
		enemies.x = 150;
		enemies.y = 50;

		var tween = game.add.tween(enemies).to({x:200}, 2000, Phaser.Easing.Linear.None, true,0,1000, true);
		tween.onRepeat.add(descend, this);
	}
}
function setupEnemy (enemy) {

    enemy.anchor.x = 0.5;
    enemy.anchor.y = 0.5;
    enemy.animations.add('kaboom');

}

function descend() {
	enemies.y +=5;
}

//handles the veent if the bullet hits the enemy
function collisionHandler(bullet, enemy){
	bullet.kill();
	enemy.kill();

	score+=100;
}

//handles the event if the player collides with the enemy
function playerHandler(player, enemy){
	player.kill();
	//  And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.reset(player.body.x, player.body.y);
    explosion.play('kaboom', 30, false, true);

	scoreText.visible = false;
	loseText.visible = true;
	playButton.visible= true;
	highscoreText.text ='Score: ' + score;
	highscoreText.visible = true;

}
//restarts the game if the player presses the button
function actionOnClick () {
	score=0;
	game.state.add('mainState',mainState);
	game.state.start('mainState');

}
game.state.add('mainState',mainState);

game.state.start('mainState');
