var Samus = function (game) {
    var s           = this,
        now         = new Date();   
    s.g             = game;
    s.animPoint     = {
        x: 0,
        y: 0
    };
    s.b             = {
        up:     {},
        down:   {},
        left:   {},
        right:  {},
        a:      {},
        b:      {},
        l:      {},
        r:      {},
        start:  {},
        select: {}
    };
    s.state         = {
        debug: {
            is: false,
            since: now
        },
        onGround: {
            is: false,
            since: now
        },
        falling: {
            is: false,
            since: now
        },
        left: {
            is: false,
            since: now
        },
        right: {
            is: false,
            since: now
        },
        hJump: {
            is: false,
            since: now
        },
        vJump: {
            is: false,
            since: now
        },
        jumpPossible: {
            is: true,
            since: now
        },
        turning: {
            is: false,
            since: now
        },
        powerGrip: {
            is: false,
            since: now
        },
        gripClimb: {
            is: false,
            since: now
        },
        gripClimbing: {
            is: false,
            since: now
        },
        gripFall: {
            is: false,
            since: now
        }
    };
    s.animations    = [
        {
            name:   'standLeft',
            fps:    3,
            loop:   true,
            frames: [18, 17, 16]
        },
        {
            name:   'standRight',
            fps:    3,
            loop:   true,
            frames: [21, 22, 23]
        },
        {
            name:   'turnLeft',
            fps:    20,
            loop:   false,
            frames: [20, 19]
        },
        {
            name:   'turnRight',
            fps:    20,
            loop:   false,
            frames: [19, 20]
        },
        {
            name:   'walkLeft',
            fps:    20,
            loop:   true,
            frames: [51, 50, 49, 48, 59, 58, 57, 56, 67, 66]
        },
        {
            name:   'walkRight',
            fps:    20,
            loop:   true,
            frames: [52, 53, 54, 55, 60, 61, 62, 63, 68, 69]
        },
        {
            name:   'hJumpLeft',
            fps:    30,
            loop:   true,
            frames: [259, 258, 257, 256, 267, 266, 265, 264]
        },
        {
            name:   'hJumpRight',
            fps:    30,
            loop:   true,
            frames: [260, 261, 262, 263, 268, 269, 270, 271]
        },
        {
            name:   'powerGripLeft',
            fps:    3,
            loop:   true,
            frames: [329, 330, 331, 330]
        },
        {
            name:   'powerGripRight',
            fps:    3,
            loop:   true,
            frames: [332, 333, 334, 333]
        },
        {
            name:   'gripClimbLeft',
            fps:    15,
            loop:   false,
            frames: [328, 339, 338, 337, 336, 347, 346]
        },
        {
            name:   'gripClimbRight',
            fps:    15,
            loop:   false,
            frames: [335, 340, 341, 342, 343, 348, 349]
        },
        {
            name:   'grabEdgeLeft',
            fps:    15,
            loop:   false,
            frames: [328]
        },
        {
            name:   'grabEdgeRight',
            fps:    15,
            loop:   false,
            frames: [335]
        },
        {
            name:   'vJumpLeft',
            fps:    15,
            loop:   false,
            frames: [187, 186, 185]
        },
        {
            name:   'vJumpRight',
            fps:    15,
            loop:   false,
            frames: [188, 189, 190]
        },
        {
            name:   'fallLeft',
            fps:    15,
            loop:   false,
            frames: [184, 195, 194]
        },
        {
            name:   'fallRight',
            fps:    15,
            loop:   false,
            frames: [191, 196, 197]
        },
        {
            name:   'landLeft',
            fps:    15,
            loop:   false,
            frames: [193, 192]
        },
        {
            name:   'landRight',
            fps:    15,
            loop:   false,
            frames: [198, 199]
        },
        {
            name:   'airTurnLeft',
            fps:    20,
            loop:   false,
            frames: [250, 249]
        },
        {
            name:   'airTurnRight',
            fps:    20,
            loop:   false,
            frames: [249, 250]
        }
    ];
};

Samus.prototype.preload = function () {
    var s   = this;
    s.g.load.spritesheet('samus', 'assets/sprites/samus.png', 50, 50);
    return s;
};

Samus.prototype.addAnimations = function () {
    var s   = this;
    for (var i = s.animations.length - 1; i >= 0; i--) {
        s.sprite.animations.add(
            s.animations[i].name,
            s.animations[i].frames,
            s.animations[i].fps,
            s.animations[i].loop
        );
    }
    return s;
};

Samus.prototype.defineButtons = function () {
    var s   = this;
    s.b.up      = s.g.input.keyboard.addKey(
        Phaser.Keyboard.W
    );
    s.b.down    = s.g.input.keyboard.addKey(
        Phaser.Keyboard.S
    );
    s.b.left    = s.g.input.keyboard.addKey(
        Phaser.Keyboard.A
    );
    s.b.right   = s.g.input.keyboard.addKey(
        Phaser.Keyboard.D
    );
    s.b.a       = s.g.input.keyboard.addKey(
        Phaser.Keyboard.UP
    );
    s.b.b       = s.g.input.keyboard.addKey(
        Phaser.Keyboard.LEFT
    );
    s.b.l       = s.g.input.keyboard.addKey(
        Phaser.Keyboard.SHIFT
    );
    s.b.r       = s.g.input.keyboard.addKey(
        Phaser.Keyboard.SPACEBAR
    );
    s.b.select  = s.g.input.keyboard.addKey(
        Phaser.Keyboard.BACKSPACE
    );
    s.b.start   = s.g.input.keyboard.addKey(
        Phaser.Keyboard.ENTER
    );
    return s;
};

Samus.prototype.create = function () {
    var s                       = this;
    s.sprite                    = s.g.add.sprite(0, 0, 'samus');
    s.g.physics.enable(s.sprite, Phaser.Physics.ARCADE);
    s.body                      = s.sprite.body;
    s.body.bounce.y             = 0;
    s.body.gravity.y            = 1500;
    s.body.collideWorldBounds   = true; 
    s.body.sticky               = true;
    s.body.setSize(16, 32, 17, 14);
    s.g.camera.follow(s.sprite);
    s.addAnimations()
     .defineButtons()
     .set('right', true)
     .sprite.animations.play('standRight');
    return s;
};

Samus.prototype.setPosition = function (x, y, direction) {
    var s = this;
    s.sprite.position.setTo(x -16, y -14);
    s.sprite.bringToTop();
    s.set('right', false)
     .set('left', false)
     .set(direction, true)
     .sprite.animations.play(
        'stand'
      + direction.charAt(0).toUpperCase()
      + direction.slice(1)
      );
    return s;
};

Samus.prototype.get = function (state, expected, since) {
    var s   = this,
        now;
    if (typeof since == 'undefined') {
        return s.state[state].is == expected;
    } else {
        now = new Date();
        return (
            s.state[state].is == expected
        &&
            now - s.state[state].since >= since
        );
    }
};

Samus.prototype.is = function (state, since) {
    var s   = this;
    return s.get(state, true, since);
};

Samus.prototype.isnt = function (state, since) {
    var s   = this;
    return s.get(state, false, since);
};

Samus.prototype.set = function (state, value) {
    var s   = this,
        now = new Date();
    s.state[state].is       = value;
    s.state[state].since    = now;
    return s;
};

Samus.prototype.update = function () {
    var s   = this;
    s.g.physics.arcade.collide(s.sprite, s.g.m.r.l.collision);
    s.updateMovement();
    return s;
};

Samus.prototype.isntGravFree = function () {
    var s   = this;
    return s.isnt('hJump') && s.isnt('powerGrip') && s.isnt('gripFall') && s.isnt('gripClimbing');
};

Samus.prototype.isOnGround = function () {
    var s   = this;
    return !(s.isnt('onGround', 4) || (!s.body.onFloor() && s.body.velocity.y < 0));
};

Samus.prototype.isntOnGround = function () {
    var s   = this;
    return !s.isOnGround();
};

Samus.prototype.setSpriteOffset = function (x, y) {
    var s   = this;
    x = x / -2;
    y = y / -2;
    s.body.setSize(16, 32, x + 17, y * 2 + 14);
    s.sprite.anchor.setTo(x / s.g.m.r.t.tileWidth, y / s.g.m.r.t.tileWidth);
    return s;
};

Samus.prototype.isAnimFinished = function () {
    var s   = this;
    return s.sprite.animations.currentAnim.isFinished;
};

Samus.prototype.isAnim = function (name) {
    var s   = this;
    return s.sprite.animations.currentAnim.name == name;
};

Samus.prototype.isntAnim = function (name) {
    var s   = this;
    return !s.isAnim(name);
};

Samus.prototype.isExclusiveDirection = function () {
    var s   = this;
    return (
        (s.b.left.isDown && !s.b.right.isDown)
        ||
        (s.b.right.isDown && !s.b.left.isDown)
    );
};

Samus.prototype.standLeft = function () {
    var s   = this;
    s.body.velocity.x = 0;
    if (s.isntAnim('standLeft') && s.isntAnim('landLeft') && s.isnt('turning'))
    {
        s.sprite.animations.stop();
        s.sprite.animations.play('standLeft');
    }
    if (s.is('turning') && s.isAnimFinished()) {
        s.set('turning', false);
        s.sprite.animations.stop();
        s.sprite.animations.play('standLeft');

    }
    if (s.isAnim('landLeft') && s.isAnimFinished()) {
        s.sprite.animations.stop();
        s.sprite.animations.play('standLeft');

    }
    return s;
};

Samus.prototype.standRight = function () {
    var s   = this;
    s.body.velocity.x = 0;
    if (s.isntAnim('standRight') && s.isntAnim('landRight') && s.isnt('turning'))
    {
        s.sprite.animations.stop();
        s.sprite.animations.play('standRight');
    }
    if (s.is('turning') && s.isAnimFinished()) {
        s.set('turning', false);
        s.sprite.animations.stop();
        s.sprite.animations.play('standRight');
    }
    if (s.isAnim('landRight') && s.isAnimFinished()) {
        s.sprite.animations.stop();
        s.sprite.animations.play('standRight');

    }
    return s;
};

Samus.prototype.walkLeft = function () {
    var s   = this;
    if (s.isnt('left')) {
        s.set('left', true);
        s.set('right', false);
        s.set('turning', true);
        s.sprite.animations.play('turnLeft');
    }
    if (s.is('turning') && s.isAnimFinished()) {
        s.set('turning', false);
    }
    if (s.isnt('turning')) {
        if (s.body.velocity.x > 0) {
            s.body.velocity.x = 0;
        }
        if (s.body.velocity.x > -180) {
            s.body.velocity.x += -15;
        }
        if (s.body.velocity.x < -180) {
            s.body.velocity.x = -180;
        }
        if (s.isntAnim('walkLeft'))
        {
            s.sprite.animations.play('walkLeft');
        }
    }
    return s;
};

Samus.prototype.walkRight = function () {
    var s   = this;
    if (s.isnt('right')) {
        s.set('right', true);
        s.set('left', false);
        s.set('turning', true);
        s.sprite.animations.play('turnRight');
    }
    if (s.is('turning') && s.isAnimFinished()) {
        s.set('turning', false);
    }
    if (s.isnt('turning')) {
        if (s.body.velocity.x < 0) {
            s.body.velocity.x = 0;
        }
        if (s.body.velocity.x < 180) {
            s.body.velocity.x += 15;
        }
        if (s.body.velocity.x > 180) {
            s.body.velocity.x = 180;
        }
        if (s.isntAnim('walkRight'))
        {
            s.sprite.animations.play('walkRight');
        }
    }
    return s;
};

Samus.prototype.airStandLeft = function () {
    var s   = this;
    if (s.body.velocity.y < 0 || s.isnt('falling')) {
        if (s.isntAnim('vJumpLeft') && s.isnt('turning'))
        {
            s.sprite.animations.stop();
            s.sprite.animations.play('vJumpLeft');
        }
    } else if (s.isnt('turning')) {
        if (s.body.velocity.y >= 0 && s.isntAnim('fallLeft')) {
            s.sprite.animations.play('fallLeft');
        }
    }
    if (s.isnt('falling')) {
        s.set('falling', true);
        s.set('jumpPossible', false);
        s.body.gravity.y = 600;
        s.body.velocity.x = -30;
    } else {
        s.body.velocity.x = 0;
    }
    if (s.is('turning') && s.isAnimFinished()) {
        s.set('turning', false);
        s.sprite.animations.stop();
        s.sprite.animations.play('vJumpLeft');

    }
    return s;
};

Samus.prototype.airStandRight = function () {
    var s   = this;
    if (s.body.velocity.y < 0 || s.isnt('falling')) {
        if (s.isntAnim('vJumpRight') && s.isnt('turning'))
        {
            s.sprite.animations.stop();
            s.sprite.animations.play('vJumpRight');
        }
    } else if (s.isnt('turning')) {
        if (s.body.velocity.y >= 0 && s.isntAnim('fallRight')) {
            s.sprite.animations.play('fallRight');
        }
    }
    if (s.isnt('falling')) {
        s.set('falling', true);
    s.set('jumpPossible', false);
        s.body.gravity.y = 600;
        s.body.velocity.x = 30;
    } else {
        s.body.velocity.x = 0;
    }
    if (s.is('turning') && s.isAnimFinished()) {
        s.set('turning', false);
        s.sprite.animations.stop();
        s.sprite.animations.play('vJumpRight');
    }
    return s;
};

Samus.prototype.airWalkLeft = function () {
    var s   = this;
    if (s.isnt('left')) {
        s.set('left', true);
        s.set('right', false);
        s.set('turning', true);
        s.sprite.animations.play('airTurnLeft');
    }
    if (s.is('turning') && s.isAnimFinished()) {
        s.set('turning', false);
        s.sprite.animations.stop();
        s.sprite.animations.play('vJumpLeft');
    }
    if (s.isnt('turning')) {
        if (s.body.velocity.x > 0) {
            s.body.velocity.x = 0;
        }
        if (s.body.velocity.x > -95) {
            s.body.velocity.x += -15;
        }
        if (s.body.velocity.x < -95) {
            s.body.velocity.x = -95;
        }
        if (s.body.velocity.y < 0 && s.isntAnim('vJumpLeft')) {
            s.sprite.animations.play('vJumpLeft');
        } else if (s.body.velocity.y >= 0 && s.isntAnim('fallLeft')) {
            s.sprite.animations.play('fallLeft');
        }
    }
    return s;
};

Samus.prototype.airWalkRight = function () {
    var s   = this;
    if (s.isnt('right')) {
        s.set('right', true);
        s.set('left', false);
        s.set('turning', true);
        s.sprite.animations.play('airTurnRight');
    }
    if (s.is('turning') && s.isAnimFinished()) {
        s.set('turning', false);
        s.sprite.animations.stop();
        s.sprite.animations.play('vJumpRight');
    }
    if (s.isnt('turning')) {
        if (s.body.velocity.x < 0) {
            s.body.velocity.x = 0;
        }
        if (s.body.velocity.x < 95) {
            s.body.velocity.x += 15;
        }
        if (s.body.velocity.x > 95) {
            s.body.velocity.x = 95;
        }
        if (s.body.velocity.y < 0 && s.isntAnim('vJumpRight')) {
            s.sprite.animations.play('vJumpRight');
        } else if (s.body.velocity.y >= 0 && s.isntAnim('fallRight')) {
            s.sprite.animations.play('fallRight');
        }
    }
    return s;
};

Samus.prototype.hJump = function () {
    var s   = this;
    if (s.is('left')) {
        if (s.isExclusiveDirection() && s.b.right.isDown) {
            s.body.velocity.x = s.body.velocity.x * -1;
            s.set('left', false);
            s.set('right', true);
            s.set('turning', false);
            s.sprite.animations.stop();
            s.sprite.animations.play('hJumpRight');
        } else {
            s.body.velocity.x = -90;
        }
    } else {
        if (s.isExclusiveDirection() && s.b.left.isDown) {
            s.body.velocity.x = s.body.velocity.x * -1;
            s.set('right', false);
            s.set('left', true);
            s.set('turning', false);
            s.sprite.animations.stop();
            s.sprite.animations.play('hJumpLeft');
        } else {
            s.body.velocity.x = 90;
        }
    }
    return s;
};

Samus.prototype.jump = function () {
    var s   = this;
    s.set('jumpPossible', false);
    if (s.isExclusiveDirection()) {
        s.set('hJump', true);
        s.body.gravity.y = 600;
        s.body.velocity.y = -290;
        if (s.b.left.isDown) {
            s.body.velocity.x = -90;
            s.set('left', true);
            s.set('right', false);
            s.set('turning', false);
            s.sprite.animations.stop();
            s.sprite.animations.play('hJumpLeft');
        } else {
            s.body.velocity.x = 90;
            s.set('right', true);
            s.set('left', false);
            s.set('turning', false);
            s.sprite.animations.stop();
            s.sprite.animations.play('hJumpRight');
        }
    } else {

        s.body.gravity.y = 600;
        s.body.velocity.y = -300;

        if (s.is('left')) {
            s.airStandLeft();
        } else {
            s.airStandRight();
        }

        s.set('vJump', true);
    }
    s.body.sticky = false;
    return s;
};

Samus.prototype.landing = function () {
    var s   = this;
    if (s.is('hJump')) {
        if (s.is('left')) {
            if (s.b.left.isDown) {
                s.sprite.animations.play('walkLeft');
            } else {
                s.sprite.animations.play('standLeft');
            }
        } else {
            if (s.b.right.isDown) {
                s.sprite.animations.play('walkRight');
            } else {
                s.sprite.animations.play('standRight');
            }
        }
        s.set('hJump', false);
    } else if (s.is('vJump') || s.is('falling')) {
        s.set('vJump', false);
        s.set('falling', false);
        if (s.is('left')) {
            s.sprite.animations.stop();
            s.sprite.animations.play('landLeft');
        } else {
            s.sprite.animations.stop();
            s.sprite.animations.play('landRight');
        }
    }
    s.body.gravity.y = 1500;
    s.body.sticky = true;
    return s;
};

Samus.prototype.grabEdge = function () {
    var s           = this,
        gripTiles   = s.g.m.r.l.collision.getTiles(
            s.body.position.x - 2,
            s.body.position.y,
            s.body.width + 4,
            s.body.height,
            false,
            false
        ),
        i,
        tile,
        spacingY,
        above,
        now             = new Date(),
        gripFall        = s.state.gripFall.is,
        gripFallSince   = now - s.state.gripFall.since;
    if (!gripFall && gripFallSince < 200) {
        return s;
    }
    for (i = 0; i < gripTiles.length; i += 1) {
        tile = gripTiles[i];
        if (tile.index > -1) {
            spacingY = s.body.position.y - tile.worldY
            if (
                spacingY > 0
             && spacingY < tile.height / 2
             &&
                (
                    (
                        s.is('left')
                     && tile.worldX + s.g.m.r.t.tileWidth / 2 < s.body.position.x
                    )
                 || (
                        s.is('right')
                     && tile.worldX + s.g.m.r.t.tileWidth / 2 > s.body.position.x + s.body.width
                    )
                )
            ) {
                above = s.g.m.r.t.getTileAbove(0, tile.x, tile.y);
                if (above && above.index == -1) {
                    s.set('hJump', false);
                    s.set('vJump', false);
                    s.set('falling', false);
                    s.set('turning', false);
                    s.body.velocity.y = 0;
                    s.body.velocity.x = 0;
                    s.body.position.y = tile.worldY;
                    s.sprite.animations.stop();
                    if (s.is('left')) {
                        s.body.position.x = tile.worldX + tile.width;
                        s.sprite.animations.play('grabEdgeLeft');
                        s.setSpriteOffset(-1,6);
                    } else {
                        s.body.position.x = tile.worldX - s.body.width;
                        s.sprite.animations.play('grabEdgeRight');
                        s.setSpriteOffset(1,6);
                    }
                    s.body.gravity.y = 0;
                    s.set('powerGrip', true);
                }
            }
        }
    }
    return s;
};

Samus.prototype.gripFall = function () {
    var s   = this;
    s.set('falling', true);
    s.set('jumpPossible', false);
    s.body.gravity.y = 600;
    s.set('powerGrip', false);
    s.set('gripFall', false);
    s.set('gripClimb', false);
    s.sprite.animations.stop();
    if (s.is('left')) {
        s.sprite.animations.play('fallLeft');
    } else {
        s.sprite.animations.play('fallRight');
    }
    s.setSpriteOffset(0,0);
    return s;
};

Samus.prototype.gripClimb = function () {
    var s           = this,
        duration    = 300,
        now         = new Date(),
        difference  = s.state.gripClimbing.is ? now - s.state.gripClimbing.since : 0,
        tempX,
        tempY,
        factor,
        factorX,
        factorY;
    if (s.isnt('gripClimbing')) {
        s.set('jumpPossible', false);
        s.set('gripClimbing', true);
        s.animPoint.x = s.body.position.x;
        s.animPoint.y = s.body.position.y;
    }
    tempY               = s.body.height / (duration / 2) * difference;
    tempY               = tempY > s.body.height ? s.body.height : tempY;
    s.body.position.y   = s.animPoint.y - tempY;
    factorY             = tempY / s.body.height;
    tempX               = difference > (duration / 2)
                          ? (s.g.m.r.t.tileWidth / (duration / 2) * difference) - s.g.m.r.t.tileWidth
                          : 0;
    factorX             = tempX / s.g.m.r.t.tileWidth;
    factor              = difference / duration;
    if (s.is('left')) {
        if (!s.isAnim('gripClimbLeft')) {
            s.sprite.animations.stop();
            s.sprite.animations.play('gripClimbLeft');
        }
        s.body.position.x = s.animPoint.x - tempX;
        s.setSpriteOffset(
            (1 - factorX) * -2,
            (1 - factor) * 7
        );
    } else {
        if (!s.isAnim('gripClimbRight')) {
            s.sprite.animations.stop();
            s.sprite.animations.play('gripClimbRight');
        }
        s.body.position.x = s.animPoint.x + tempX;
        s.setSpriteOffset(
            (1 - factorX) * 2,
            (1 - factor) * 7
        );
    }
    if (difference > duration) {
        s.set('gripClimbing',   false);
        s.set('powerGrip',      false);
        s.set('gripClimb',      false);
        s.set('gripFall',       false);
        s.set('turning',        false);
        s.body.gravity.y        = 1500;
        s.body.position.y       = s.animPoint.y - s.body.height;
        if (s.is('left')) {
            s.body.position.x   = s.animPoint.x - s.g.m.r.t.tileWidth;
        } else {
            s.body.position.x   = s.animPoint.x + s.g.m.r.t.tileWidth;
        }
        s.sprite.animations.stop();
        if (s.is('left')) {
            if (s.b.left.isDown) {
                s.sprite.animations.play('walkLeft');
            } else {
                s.sprite.animations.play('standLeft');
            }
        } else {
            if (s.b.right.isDown) {
                s.sprite.animations.play('walkRight');
            } else {
                s.sprite.animations.play('standRight');
            }
        }
        s.setSpriteOffset(0,0);
    }
    return s;
};

Samus.prototype.powerGrip = function () {
    var s = this,
        climbUp = (
                s.is('gripClimb')
                &&
                (
                    s.b.up.isDown
                    ||
                    (
                        s.b.a.isDown
                        &&
                        s.b.left.isDown
                        &&
                        s.is('left')
                    )
                    ||
                    (
                        s.b.a.isDown
                        &&
                        s.b.right.isDown
                        &&
                        s.is('right')
                    )
                )
            )
            ||
            s.is('gripClimbing');
    if (s.isAnim('grabEdgeLeft') && s.isAnimFinished()) {
        s.sprite.animations.stop();
        s.sprite.animations.play('powerGripLeft');
        s.setSpriteOffset(-2,7);

    }
    if (s.isAnim('grabEdgeRight') && s.isAnimFinished()) {
        s.sprite.animations.stop();
        s.sprite.animations.play('powerGripRight');
        s.setSpriteOffset(2,7);
    }
    if (s.b.down.isDown && s.is('gripFall')) {
        s.gripFall();
    } else if (climbUp) {
        s.gripClimb();
    } else if (s.b.up.isUp && s.b.a.isUp && s.isnt('gripClimb')) {
        s.set('gripClimb', true);
    } else if (s.b.down.isUp && s.isnt('gripFall')) {
        s.set('gripFall', true);
    }
    return s;
};

Samus.prototype.updateMovement = function () {
    var s   = this;
    if (s.body.onFloor() && s.isnt('onGround')) {
        s.set('onGround', true);
    } else if (!s.body.onFloor() && s.is('onGround')) {
        s.set('onGround', false);
    }
    if (s.isOnGround() && (s.is('vJump') || s.is('hJump') || s.is('falling'))) {
        s.landing();
    }
    if (s.isntGravFree()) {
        if (s.b.a.isDown && s.isOnGround() && s.is('jumpPossible')) {
            s.jump();
        } else if (s.isExclusiveDirection() && s.isOnGround()) {
            if (s.b.left.isDown) {
                s.walkLeft();
            } else {
                s.walkRight();
            }
        } else if (s.isOnGround()) {
            if (s.is('left')) {
                s.standLeft();
            } else {
                s.standRight();
            }
        } else if (s.isntOnGround() && s.isnt('falling')) {
            if (s.is('left')) {
                s.airStandLeft();
            } else {
                s.airStandRight();
            }
        }
    }
    if (s.b.a.isUp && s.isOnGround()) {
        s.set('jumpPossible', true);
    }
    if (s.b.a.isUp && s.isntOnGround() && s.isnt('jumpPossible')) {
        if (s.body.velocity.y < -50) {
            s.body.velocity.y = -50;            
        }
    }
    if (s.is('hJump')) {
        s.hJump();
    }
    if (s.body.velocity.y > 0 && s.isExclusiveDirection()) {
        s.grabEdge();
    }
    if (s.is('powerGrip')) {
        s.powerGrip();
    } else {
        if (s.is('vJump') || s.is('falling')) {
            if (s.isExclusiveDirection()) {
                if (s.b.left.isDown) {
                    s.airWalkLeft();
                } else {
                    s.airWalkRight();
                }
            } else {
                if (s.is('left')) {
                    s.airStandLeft();
                } else {
                    s.airStandRight();
                }
            }
        }
    }
    if (s.body.velocity.y > 400) {
        s.body.velocity.y = 400;
    }
    return s;
};

Samus.prototype.render = function () {
    var s   = this;
    if (s.is('debug')) {
        s.g.debug.body(s.sprite);
    }
    return s;
};