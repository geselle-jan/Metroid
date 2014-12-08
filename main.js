var game = new Phaser.Game(240, 160, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render }, false, false);

function preload() {

    game.load.tilemap('srx1', 'assets/srx1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('collision', 'assets/collision.png');
    game.load.image('srx', 'assets/srx.png');
    game.load.spritesheet('samus', 'assets/samus.png', 50, 50);
    game.load.image('sr388cave', 'assets/sr388cave.png');

}

var map;
var tileset;
var layer;
var deco1;
var deco2;
var player;
var facing = 'left';
var direction = 'left';
var turning = false;
var jumpPressed = false;
var cursors;
var jumpButton;
var bg;
var airTiles;
var motion = 0;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#000000';

    bg = game.add.tileSprite(0, 0, 480, 320, 'sr388cave');
    bg.fixedToCamera = true;

    map = game.add.tilemap('srx1');

    map.addTilesetImage('collision');

    layer = map.createLayer('collision');

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


    map.addTilesetImage('srx');
    deco2 = map.createLayer('deco2');

    player = game.add.sprite(map.objects.doors[0].x, map.objects.doors[0].y -19, 'samus');
    game.physics.enable(player, Phaser.Physics.ARCADE);

    player.body.bounce.y = 0;
    player.body.collideWorldBounds = true;
    player.body.setSize(16, 32, 17, 18);

    player.animations.add('standLeft', [18, 17, 16], 3, true);
    player.animations.add('standRight', [21, 22, 23], 3, true);
    player.animations.add('turnLeft', [20, 19], 20, false);
    player.animations.add('turnRight', [19, 20], 20, false);
    player.animations.add('walkLeft', [51, 50, 49, 48, 59, 58, 57, 56, 67, 66], 20, true);
    player.animations.add('walkRight', [52, 53, 54, 55, 60, 61, 62, 63, 68, 69], 20, true);

    game.camera.follow(player);

    deco1 = map.createLayer('deco1');

    game.physics.arcade.gravity.y = 1000;

    cursors = game.input.keyboard.createCursorKeys();
    //jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    jumpButton = cursors.up;

    jumpButton.isTouched = false;

    $('body').on('touchstart', function (e) {
        e.preventDefault();
        jumpButton.isTouched = true;
    }).on('touchend', function (e) {
        e.preventDefault();
        jumpButton.isTouched = false;
    });

    window.ondeviceorientation = function(event) {
        motion = Math.round(event.beta);
    };

}

function update() {

    bg.tilePosition.x = Math.round(game.camera.position.x / -2);
    bg.tilePosition.y = Math.round(game.camera.position.y / -2);

    game.physics.arcade.collide(player, layer);

    if (cursors.left.isDown || motion < -5)
    {
        if (direction != 'left') {
            direction = 'left';
            turning = true;
            player.animations.play('turnLeft');
        }
        if (turning && player.animations.currentAnim.isFinished) {
            turning = false;
        }
        if (!turning) {
            if (player.body.velocity.x > 0) {
                player.body.velocity.x = 0;
            }
            if (player.body.velocity.x > -180) {
                player.body.velocity.x += -15;
            }
            if (player.body.velocity.x < -180) {
                player.body.velocity.x = -180;
            }

            if (facing != 'left')
            {
                facing = 'left';
                player.animations.play('walkLeft');
            }
        }

    }
    else if (cursors.right.isDown || motion > 5)
    {
        if (direction != 'right') {
            direction = 'right';
            turning = true;
            player.animations.play('turnRight');
        }
        if (turning && player.animations.currentAnim.isFinished) {
            turning = false;
        }
        if (!turning) {
            if (player.body.velocity.x < 0) {
                player.body.velocity.x = 0;
            }
            if (player.body.velocity.x < 180) {
                player.body.velocity.x += 15;
            }
            if (player.body.velocity.x > 180) {
                player.body.velocity.x = 180;
            }

            if (facing != 'right')
            {
                facing = 'right';
                player.animations.play('walkRight');
            }
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
                player.animations.play('standLeft');
            }
            else
            {
                player.animations.play('standRight');
            }

            facing = 'idle';
        }
        if (turning && player.animations.currentAnim.isFinished) {
            if (direction == 'left')
            {
                facing = 'left';
                turning = false;
            }
            else
            {
                facing = 'right';
                turning = false;
            }
        }
    }
    
    if ( (jumpButton.isDown || jumpButton.isTouched) && player.body.onFloor() && !jumpPressed)
    {
        player.body.velocity.y = -420;
        jumpPressed = true;
    } else if (jumpButton.isUp && !jumpButton.isTouched && !player.body.onFloor() && jumpPressed) {
        if (player.body.velocity.y < -50) {
            player.body.velocity.y = -50;            
        }
        jumpPressed = false;
    } else if (jumpButton.isUp && !jumpButton.isTouched && player.body.onFloor()) {
        jumpPressed = false;
    }

}

function render () {

    // game.debug.text(game.time.physicsElapsed, 32, 32);
    // game.debug.body(player);
    // game.debug.bodyInfo(player, 16, 24);
}