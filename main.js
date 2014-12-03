var game = new Phaser.Game(1024, 512, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render }, false, false);

function preload() {

    game.load.tilemap('level1', 'assets/level1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('Collision', 'assets/collision.png');
    game.load.image('Test', 'assets/tiles-1.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.image('background', 'assets/background2.png');

}

var map;
var tileset;
var layer;
var deco;
var player;
var facing = 'left';
var jumpPressed = false;
var cursors;
var jumpButton;
var bg;
var airTiles;

function create() {

    game.stage.smoothed = false;

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#000000';

    bg = game.add.tileSprite(0, 0, 1024, 512, 'background');
    bg.fixedToCamera = true;

    map = game.add.tilemap('level1');

    map.addTilesetImage('Collision');

    layer = map.createLayer('col');

    layer.layer.data.forEach(function(e){
        e.forEach(function(t){
            if (t.index < 0) {
                // none
            } else if (t.index === 1) {
                t.slope = 'FULL_SQUARE';
            } else if (t.index === 2) {
                t.slope = 'HALF_TRIANGLE_BOTTOM_RIGHT';
            } else if (t.index === 3) {
                t.slope = 'HALF_TRIANGLE_BOTTOM_LEFT';
            } else if (t.index === 4) {
                t.slope = 'LONG_TRIANGLE_BOTTOM_RIGHT_LOW';
            } else if (t.index === 5) {
                t.slope = 'LONG_TRIANGLE_BOTTOM_RIGHT_HIGH';
            } else if (t.index === 6) {
                t.slope = 'LONG_TRIANGLE_BOTTOM_LEFT_HIGH';
            } else if (t.index === 7) {
                t.slope = 'LONG_TRIANGLE_BOTTOM_LEFT_LOW';
            }else{
                //console.log(t.index);
            }
            // you could also add custom collide function;
            // t.slopeFunction = function (i, body, tile) { custom code }
        });
    });

    map.setCollision([1,2,3,4,5,6,7]);

    //  Un-comment this on to see the collision tiles
    //layer.debug = true;

    layer.resizeWorld();
    layer.visible = false

    player = game.add.sprite(32, 32, 'dude');
    game.physics.enable(player, Phaser.Physics.ARCADE);

    player.body.bounce.y = 0;
    player.body.collideWorldBounds = true;
    player.body.setSize(16, 32, 8, 16);

    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('turn', [4], 20, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    game.camera.follow(player);

    map.addTilesetImage('Test');
    deco = map.createLayer('deco');

    game.physics.arcade.gravity.y = 1000;


    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

}

function update() {

    game.physics.arcade.collide(player, layer);

    if (cursors.left.isDown)
    {
        if (player.body.velocity.x > 0) {
            player.body.velocity.x = 0;
        }
        if (player.body.velocity.x > -350) {
            player.body.velocity.x += -15;
        }
        if (player.body.velocity.x < -350) {
            player.body.velocity.x = -350;
        }

        if (facing != 'left')
        {
            player.animations.play('left');
            facing = 'left';
        }
    }
    else if (cursors.right.isDown)
    {
        if (player.body.velocity.x < 0) {
            player.body.velocity.x = 0;
        }
        if (player.body.velocity.x < 350) {
            player.body.velocity.x += 15;
        }
        if (player.body.velocity.x > 350) {
            player.body.velocity.x = 350;
        }

        if (facing != 'right')
        {
            player.animations.play('right');
            facing = 'right';
        }
    }
    else
    {
        if (player.body.onFloor()) {
            if (player.body.velocity.x > 0) {
                player.body.velocity.x += -50;
            } else if (player.body.velocity.x < 0) {
                player.body.velocity.x += 50;
            }
            if (player.body.velocity.x < 50 && player.body.velocity.x > -50) {
                player.body.velocity.x = 0;
            }
        }
        if (facing != 'idle')
        {
            player.animations.stop();

            if (facing == 'left')
            {
                player.frame = 0;
            }
            else
            {
                player.frame = 5;
            }

            facing = 'idle';
        }
    }
    
    if (cursors.up.isDown && player.body.onFloor() && !jumpPressed)
    {
        player.body.velocity.y = -500;
        jumpPressed = true;
    } else if (cursors.up.isUp && !player.body.onFloor() && jumpPressed) {
        if (player.body.velocity.y < -50) {
            player.body.velocity.y = -50;            
        }
        jumpPressed = false;
    } else if (cursors.up.isUp && player.body.onFloor()) {
        jumpPressed = false;
    }

}

function render () {

    // game.debug.text(game.time.physicsElapsed, 32, 32);
    //game.debug.body(player);
    //game.debug.bodyInfo(player, 16, 24);
}