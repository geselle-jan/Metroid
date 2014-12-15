var game    = new Phaser.Game(240, 160, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render }, false, false),
    g       = game,
    samus   = new Samus(game);
g.s = samus;


function preload() {

    game.load.tilemap('srx1', 'assets/srx1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('collision', 'assets/collision.png');
    game.load.image('srx', 'assets/srx.png');
    game.load.image('sr388cave', 'assets/sr388cave.png');
    samus.preload();

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
var horizontalJump = false;
var verticalJump = false;
var gripTiles;
var powerGrip = false;
var gripClimb = false;
var gripFall = false;
var setSpriteOffset = function (x,y) {
    player.body.setSize(16, 32, x + 17, y * 2 + 14);
    player.anchor.setTo(x / map.tileWidth, y / map.tileWidth);
};

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

    samus.create(map.objects.doors[0].x, map.objects.doors[0].y);

    player = game.add.sprite(map.objects.doors[0].x, map.objects.doors[0].y -19, 'samus');
    game.physics.enable(player, Phaser.Physics.ARCADE);

    player.body.bounce.y = 0;
    player.body.collideWorldBounds = true;
    player.body.setSize(16, 32, 17, 14);

    player.animations.add('standLeft', [18, 17, 16], 3, true);
    player.animations.add('standRight', [21, 22, 23], 3, true);
    player.animations.add('turnLeft', [20, 19], 20, false);
    player.animations.add('turnRight', [19, 20], 20, false);
    player.animations.add('walkLeft', [51, 50, 49, 48, 59, 58, 57, 56, 67, 66], 20, true);
    player.animations.add('walkRight', [52, 53, 54, 55, 60, 61, 62, 63, 68, 69], 20, true);
    player.animations.add('horizontalJumpLeft', [259, 258, 257, 256, 267, 266, 265, 264], 30, true);
    player.animations.add('horizontalJumpRight', [260, 261, 262, 263, 268, 269, 270, 271], 30, true);
    player.animations.add('powerGripLeft', [329, 330, 331, 330], 3, true);
    player.animations.add('powerGripRight', [332, 333, 334, 333], 3, true);

    game.camera.follow(player);

    deco1 = map.createLayer('deco1');

    player.body.gravity.y = 1500;

    cursors = game.input.keyboard.createCursorKeys();
    //jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    jumpButton = cursors.up;

    jumpButton.isTouched = false;

}

function update() {

    bg.tilePosition.x = Math.round(game.camera.position.x / -2);
    bg.tilePosition.y = Math.round(game.camera.position.y / -2);

    samus.update(layer);

    game.physics.arcade.collide(player, layer);

    if (cursors.left.isDown && !cursors.right.isDown && !horizontalJump && !powerGrip)
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
    else if (cursors.right.isDown && !cursors.left.isDown && !horizontalJump && !powerGrip)
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
        if (player.body.onFloor() || verticalJump) {
            player.body.velocity.x = 0;
        }
        if (facing != 'idle' && player.body.onFloor())
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

    if (player.body.onFloor()) {
        if (horizontalJump) {
            if (direction == 'left')
            {
                if (cursors.left.isDown) {
                    player.animations.play('walkLeft');
                } else {
                    player.animations.play('standLeft');
                }
            }
            else
            {
                if (cursors.right.isDown) {
                    player.animations.play('walkRight');
                } else {
                    player.animations.play('standRight');
                }
            }
            horizontalJump = false;
            player.body.gravity.y = 1000;
        }
        verticalJump = false;
    }
    
    if ( (jumpButton.isDown || jumpButton.isTouched) && player.body.onFloor() && !jumpPressed)
    {
        player.body.velocity.y = -420;
        jumpPressed = true;
        if (cursors.right.isDown || cursors.left.isDown) {
            horizontalJump = true;
            player.body.gravity.y = 600;
            player.body.velocity.y = -290;
            if (cursors.left.isDown) {
                player.body.velocity.x = -90;
                direction = 'left';
                turning = false;
                player.animations.stop();
                player.animations.play('horizontalJumpLeft');
            } else {
                player.body.velocity.x = 90;
                direction = 'right';
                turning = false;
                player.animations.stop();
                player.animations.play('horizontalJumpRight');
            }
        } else {
            verticalJump = true;
        }
    } else if (jumpButton.isUp && !jumpButton.isTouched && !player.body.onFloor() && jumpPressed) {
        if (player.body.velocity.y < -50) {
            player.body.velocity.y = -50;            
        }
        jumpPressed = false;
    } else if (jumpButton.isUp && !jumpButton.isTouched && player.body.onFloor()) {
        jumpPressed = false;
    }

    if (horizontalJump) {
        if (direction == 'left') {
            player.body.velocity.x = -90;
        } else {
            player.body.velocity.x = 90;
        }
    }

    if (player.body.velocity.y > 0 && (cursors.left.isDown || cursors.right.isDown)) {

        gripTiles = layer.getTiles(
            player.body.position.x - 2,
            player.body.position.y,
            player.body.width + 4,
            player.body.height,
            false,
            false
        );

        for (var i = 0, tile, spacingY; i < gripTiles.length; i += 1) {
            tile = gripTiles[i];
            if (tile.index > -1) {
                spacingY = player.body.position.y - tile.worldY
                if (
                    spacingY > 0
                 && spacingY < tile.height / 2
                 &&
                    (
                        (
                            direction == 'left'
                         && tile.worldX + map.tileWidth / 2 < player.body.position.x
                        )
                     || (
                            direction == 'right'
                         && tile.worldX + map.tileWidth / 2 > player.body.position.x + player.body.width
                        )
                    )
                ) {
                    if (map.getTileAbove(0, tile.x, tile.y).index == -1) {
                        horizontalJump = false;
                        verticalJump = false;
                        player.body.velocity.y = 0;
                        player.body.velocity.x = 0;
                        player.body.position.y = tile.worldY;
                        player.animations.stop();
                        if (direction == 'left') {
                            player.body.position.x = tile.worldX + tile.width;
                            player.animations.play('powerGripLeft');
                            setSpriteOffset(1,-3.5);
                        } else {
                            player.body.position.x = tile.worldX - player.body.width;
                            player.animations.play('powerGripRight');
                            setSpriteOffset(-1,-3.5);
                        }
                        player.body.gravity.y = 0;
                        powerGrip = true;
                    }
                }
            }
        }

    }

    if (powerGrip) {
        if (cursors.down.isDown && gripFall) {
            player.body.gravity.y = 1000;
            powerGrip = false;
            gripFall = false;
            gripClimb = false;
            player.animations.stop();
            if (direction == 'left') {
                player.animations.play('standLeft');
            } else {
                player.animations.play('standRight');
            }
            setSpriteOffset(0,0);
        }
        if (cursors.up.isDown && gripClimb) {
            player.body.gravity.y = 1000;
            powerGrip = false;
            gripFall = false;
            gripClimb = false;
            jumpPressed = true;
            player.body.position.y = player.body.position.y - player.body.height;
            if (direction == 'left') {
                player.body.position.x -= map.tileWidth;
            } else {
                player.body.position.x += map.tileWidth;
            }
            player.animations.stop();
            if (direction == 'left') {
                if (cursors.left.isDown) {
                    player.animations.play('walkLeft');
                } else {
                    player.animations.play('standLeft');
                }
            } else {
                if (cursors.right.isDown) {
                    player.animations.play('walkRight');
                } else {
                    player.animations.play('standRight');
                }
            }
            setSpriteOffset(0,0);
        }
        if (cursors.up.isUp) {
            gripClimb = true;
        }
        if (cursors.down.isUp) {
            gripFall = true;
        }
    }

}

function render () {

    // game.debug.text(game.time.physicsElapsed, 32, 32);
    // game.debug.body(player);
    // game.debug.bodyInfo(player, 16, 24);
}