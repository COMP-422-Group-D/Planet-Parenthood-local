
var game = new Phaser.Game(400, 650, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.image('bullet', '../media/images/bullet.png');
    game.load.image('enemyBullet', '../media/images/enemy_bullet.png');
    game.load.image('invader', '../media/images/enemy.png');
	game.load.image('boss', '../media/images/fetus.png');
    game.load.image('ship', '../media/images/ship.png');
	//game.load.image('shield', '../media/images/shield.png');
	game.load.image('ship_lives', '../media/images/ship_lives.png');
    game.load.spritesheet('kaboom', '../media/images/explosion.png', 128, 128);
    game.load.image('starfield', '../media/images/background.png');
	game.load.image('game_over', '../media/images/game_over.png');
	game.load.image('button','../media/images/retry.png');
	game.load.image('menu_button','../media/images/menu_button.png');
	game.load.image('platform','../media/images/invisi_plat.png');
	game.load.spritesheet('horizontal_buttons','../media/images/button-horizontal.png',96,64);
	game.load.spritesheet('a_button','../media/images/button-round-a.png',96,96);
	}
var stick;
var buttonA;
var pad;

var player;
var shield;
var aliens;

var bosses;
var bossBullets;

var bullets;
var bulletTime = 0;
var cursors;
var fireButton;
var explosions;
var starfield;
var score = 0;
var scoreString = '';
var scoreText;
var lives;
var enemyBullet;
var firingTimer = 0;
var stateText;
var livingEnemies = [];
var platform;
var scoreText;
var loseText;
var gameOverScreen;

var playButton;
var left=false;
var right= false;
var fire= false;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  The scrolling starfield background
    starfield = game.add.tileSprite(0, 0, 400, 650, 'starfield');

    //  Our bullet group
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 1);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

    // The enemy's bullets
    enemyBullets = game.add.group();
    enemyBullets.enableBody = true;
    enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    enemyBullets.createMultiple(30, 'enemyBullet');
    enemyBullets.setAll('anchor.x', 0.5);
    enemyBullets.setAll('anchor.y', 1);
    enemyBullets.setAll('outOfBoundsKill', true);
    enemyBullets.setAll('checkWorldBounds', true);

    //  The hero!
    player = game.add.sprite(game.world.centerX, game.world.centerY+240, 'ship');
    player.anchor.setTo(0.5, 0.5);
    game.physics.enable(player, Phaser.Physics.ARCADE);
	player.body.collideWorldBounds = true;
	
	buttonfire = game.add.button(300, 550, 'a_button', null, this, 0, 1, 0, 1);
    buttonfire.fixedToCamera = true;
    buttonfire.events.onInputOver.add(function(){fire=true;});
    buttonfire.events.onInputOut.add(function(){fire=false;});
    buttonfire.events.onInputDown.add(function(){fire=true;});
    buttonfire.events.onInputUp.add(function(){fire=false;});       
	buttonfire.visible = true;

    buttonleft = game.add.button(20, 560, 'horizontal_buttons', null, this, 0, 1, 0, 1);
    buttonleft.fixedToCamera = true;
    buttonleft.events.onInputOver.add(function(){left=true;});
    buttonleft.events.onInputOut.add(function(){left=false;});
    buttonleft.events.onInputDown.add(function(){left=true;});
    buttonleft.events.onInputUp.add(function(){left=false;});
	buttonleft.visible = true;
	
	buttonright = game.add.button(140, 560, 'horizontal_buttons', null, this, 0, 1, 0, 1);
    buttonright.fixedToCamera = true;
    buttonright.events.onInputOver.add(function(){right=true;});
    buttonright.events.onInputOut.add(function(){right=false;});
    buttonright.events.onInputDown.add(function(){right=true;});
    buttonright.events.onInputUp.add(function(){right=false;});
	buttonright.visible = true;

	//platform
	platform = game.add.sprite(game.world.centerX, game.world.centerY+350, 'platform');
    platform.anchor.setTo(0.5, 0.5);
    game.physics.enable(platform, Phaser.Physics.ARCADE);

    aliens = game.add.group();
    aliens.enableBody = true;
    aliens.physicsBodyType = Phaser.Physics.ARCADE;

	createAliens();
  

	/*bosses = game.add.group();
    bosses.enableBody = true;
    bosses.physicsBodyType = Phaser.Physics.ARCADE;
	*/
    //  The score
    scoreString = 'Score : ';
    scoreText = game.add.text(0, 0, scoreString + score, { font: '32px Verdana', fill: '#fff' });

    //  Lives
    lives = game.add.group();
    game.add.text(game.world.width - 125, 0, 'Lives : ', { font: '32px Verdana', fill: '#fff' });

	gameOverScreen = game.add.image(game.world.centerX-110, game.world.centerY-120,'game_over');
	gameOverScreen.visible = false;; 
	
	loseText = game.add.text(game.world.centerX-80, game.world.centerY-100, 'You are dead!',{font: '32px Verdana',fill: '#ff0000'});
	loseText.visible = false;
		
	highscoreText= game.add.text(game.world.centerX-60, game.world.centerY-40, 'Score: ',{font: '32px Verdana',fill: '#fff' });
	highscoreText.visible= false;
		
	playButton = game.add.button(game.world.centerX-15, 350, 'button', restart, this, 2, 1, 0);
	playButton.visible = false;
	
	menuButton = game.add.button(game.world.centerX-15, 400, 'menu_button', openMenu, this, 2, 1, 0);
	menuButton.visible = false;

    for (var i = 0; i < 3; i++) 
    {
        var ship = lives.create(game.world.width - 100 + (30 * i), 60, 'ship_lives');
        ship.anchor.setTo(0.5, 0.5);
        ship.angle = 90;
        ship.alpha = 0.4;
    }

    //  An explosion pool
    explosions = game.add.group();
    explosions.createMultiple(30, 'kaboom');
    explosions.forEach(setupInvader, this);

    //  And some controls to play the game with
    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    
}
//this will organize all of the enemies on the screen

function createAliens () {

    for (var y = 0; y < 4; y++)
    {
        for (var x = 0; x < 8; x++)
        {
            var alien = aliens.create(x * 43, y * 60, 'invader');
            alien.anchor.setTo(1.9, 0.5);
        }
    }

    aliens.x = 110;
    aliens.y = 50;

    //  All this does is basically start the invaders moving. Notice we're moving the Group they belong to, rather than the invaders directly.
    var tween = game.add.tween(aliens).to( { x: 175 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);

    //  When the tween loops it calls descend
    tween.onRepeat.add(descend, this);
}/*
function createBoss() {

    var boss = bosses.create(x * 43, y * 60, 'boss');
    boss.anchor.setTo(1.9, 0.5);

    bosses.x = 110;
    bosses.y = 50;

    //  All this does is basically start the invaders moving. Notice we're moving the Group they belong to, rather than the invaders directly.
    var tween = game.add.tween(bosses).to( { x: 175 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);

    //  When the tween loops it calls descend
    tween.onRepeat.add(descend, this);
}
*/
function setupInvader (invader) {

    invader.anchor.x = 0.5;
    invader.anchor.y = 0.5;
    invader.animations.add('kaboom');

}

function descend() {

    aliens.y += 10;

}

function update() {

    //  Scroll the background
    starfield.tilePosition.y += 2;

    if (player.alive)
    {
        //  Reset the player, then check for movement keys
        player.body.velocity.setTo(0, 0);

        if ((cursors.left.isDown) || left)
        {
            player.body.velocity.x = -200;
        }
        else if ((cursors.right.isDown) || right)
        {
            player.body.velocity.x = 200;
        }

        //  Firing?
        if (fireButton.isDown || fire)
        {
            fireBullet();
        }

        if (game.time.now > firingTimer)
        {
            enemyFires();
        }
		if (aliens.y > 650) {
			aliens.kill();
		}
        //  Run collision
        game.physics.arcade.overlap(bullets, aliens, collisionHandler, null, this);
        game.physics.arcade.overlap(enemyBullets, player, enemyHitsPlayer, null, this);
		game.physics.arcade.overlap(aliens, player, enemyHitsPlayer, null, this);
		game.physics.arcade.overlap(platform,aliens, outOfBoundsHandler, null, this);
    }

}

function render() {

    // for (var i = 0; i < aliens.length; i++)
    // {
    //     game.debug.body(aliens.children[i]);
    // }

}

function collisionHandler (bullet, alien) {

    //  When a bullet hits an alien we kill them both
    bullet.kill();
    alien.kill();

    //  Increase the score
    score += 20;
    scoreText.text = scoreString + score;

    //  And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.reset(alien.body.x, alien.body.y);
    explosion.play('kaboom', 30, false, true);

    if (aliens.countLiving() == 0)
    {
        score += 1000;
        createAliens();
    }

}

function outOfBoundsHandler (alien, platform) {
    platform.kill();
	
    if (aliens.countLiving() == 0)
    {
        createAliens();
    }

}
function enemyHitsPlayer (player,bullet) {
    
    bullet.kill();

    live = lives.getFirstAlive();

    if (live)
    {
        live.kill();
    }

    //  And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.reset(player.body.x, player.body.y);
    explosion.play('kaboom', 30, false, true);

    // When the player dies
    if (lives.countLiving() < 1)
    {
        player.kill();
        enemyBullets.callAll('kill');
		gameOverScreen.visible = true;
		scoreString.visible = false;
		scoreText.visible = false;
		loseText.visible = true;
		playButton.visible= true;
		indexedDBHighscore(score);
		highscoreText.text ='Score: ' + score;
		highscoreText.visible = true;
		menuButton.visible = true;
		buttonfire.visible = false;
		buttonleft.visible = false;
		buttonright.visible = false;
    }

}

function enemyFires () {

    //  Grab the first bullet we can from the pool
    enemyBullet = enemyBullets.getFirstExists(false);

    livingEnemies.length=0;

    aliens.forEachAlive(function(alien){

        // put every living enemy in an array
        livingEnemies.push(alien);
    });


    if (enemyBullet && livingEnemies.length > 0)
    {
        
        var random=game.rnd.integerInRange(0,livingEnemies.length-1);

        // randomly select one of them
        var shooter=livingEnemies[random];
        // And fire the bullet from this enemy
        enemyBullet.reset(shooter.body.x+40, shooter.body.y+50);

        game.physics.arcade.moveToObject(enemyBullet,player,120);
        firingTimer = game.time.now + 2000;
    }

}

function fireBullet () {

    //  To avoid them being allowed to fire too fast we set a time limit
    if (game.time.now > bulletTime)
    {
        //  Grab the first bullet we can from the pool
        bullet = bullets.getFirstExists(false);

        if (bullet)
        {
            //  And fire it
            bullet.reset(player.x, player.y + 8);
            bullet.body.velocity.y = -400;
            bulletTime = game.time.now + 200;
        }
    }

}

function resetBullet (bullet) {

    //  Called if the bullet goes out of the screen
    bullet.kill();

}
function openMenu() {
	window.open("../html/menu.html");
	
}
function restart () {

    //  A new level starts
    score = 0;
    //resets the life count
    lives.callAll('revive');
    //  And brings the aliens back from the dead :)
    aliens.removeAll();
    createAliens();
	gameOverScreen.visible= false;
	loseText.visible = false;
	highscoreText.visible = false;
	playButton.visible = false;
	menuButton.visible = false;
	scoreString.visible = true;
	scoreText.visible = true;
	
	buttonfire.visible = true;
	buttonleft.visible = true;
	buttonright.visible = true;
	

    //revives the player
    player.revive();
    //hides the text
    stateText.visible = false;

}
