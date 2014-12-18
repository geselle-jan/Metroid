var Samus = function (game) {
    var s           = this,
        now         = new Date();   
    s.g             = game;
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

Samus.prototype.isOnGround = function () {
    var s   = this;
    return s.isnt('hJump') && s.isnt('powerGrip') && s.isnt('gripFall');
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
    if (s.isntAnim('standLeft') && s.isnt('turning'))
    {
        s.sprite.animations.stop();
        s.sprite.animations.play('standLeft');
    }
    if (s.is('turning') && s.isAnimFinished()) {
        s.set('turning', false);
        s.sprite.animations.stop();
        s.sprite.animations.play('standLeft');

    }
    return s;
};

Samus.prototype.standRight = function () {
    var s   = this;
    s.body.velocity.x = 0;
    if (s.isntAnim('standRight') && s.isnt('turning'))
    {
        s.sprite.animations.stop();
        s.sprite.animations.play('standRight');
    }
    if (s.is('turning') && s.isAnimFinished()) {
        s.set('turning', false);
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

Samus.prototype.jump = function () {
    var s   = this;
    s.body.velocity.y = -420;
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
        s.set('vJump', true);
    }
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
        s.body.gravity.y = 1500;
        s.set('hJump', false);
    }
    s.set('vJump', false);
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
        above;
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
                    s.body.velocity.y = 0;
                    s.body.velocity.x = 0;
                    s.body.position.y = tile.worldY;
                    s.sprite.animations.stop();
                    if (s.is('left')) {
                        s.body.position.x = tile.worldX + tile.width;
                        s.sprite.animations.play('powerGripLeft');
                        s.setSpriteOffset(-2,7);
                    } else {
                        s.body.position.x = tile.worldX - s.body.width;
                        s.sprite.animations.play('powerGripRight');
                        s.setSpriteOffset(2,7);
                    }
                    s.body.gravity.y = 0;
                    s.set('powerGrip', true);
                }
            }
        }
    }
    return s;
};

Samus.prototype.powerGrip = function () {
    var s = this;
    if (s.b.down.isDown && s.is('gripFall')) {
        s.body.gravity.y = 1000;
        s.set('powerGrip', false);
        s.set('gripFall', false);
        s.set('gripClimb', false);
        s.sprite.animations.stop();
        if (s.is('left')) {
            s.sprite.animations.play('standLeft');
        } else {
            s.sprite.animations.play('standRight');
        }
        s.setSpriteOffset(0,0);
    } else if (s.b.up.isDown && s.is('gripClimb')) {
        s.body.gravity.y = 1000;
        s.set('powerGrip', false);
        s.set('gripFall', false);
        s.set('gripClimb', false);
        s.set('jumpPossible', false);
        s.body.position.y = s.body.position.y - s.body.height;
        if (s.is('left')) {
            s.body.position.x -= s.g.m.r.t.tileWidth;
        } else {
            s.body.position.x += s.g.m.r.t.tileWidth;
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
    } else if (s.b.up.isUp && s.isnt('gripClimb')) {
        s.set('gripClimb', true);
    } else if (s.b.down.isUp && s.isnt('gripFall')) {
        s.set('gripFall', true);
    }
    return s;
};

Samus.prototype.updateMovement = function () {
    var s   = this;
    if (s.body.onFloor() && (s.is('vJump') || s.is('hJump'))) {
        s.landing();
    }
    if (s.isOnGround()) {
        if (s.b.a.isDown && s.sprite.body.onFloor() && s.is('jumpPossible')) {
            s.jump();
        } else if (s.isExclusiveDirection()) {
            if (s.b.left.isDown) {
                s.walkLeft();
            } else {
                s.walkRight();
            }
        } else {
            if (s.is('left')) {
                s.standLeft();
            } else {
                s.standRight();
            }
        }
    }
    if (s.b.a.isUp && s.body.onFloor()) {
        s.set('jumpPossible', true);
    }
    if (s.b.a.isUp && !s.sprite.body.onFloor() && s.isnt('jumpPossible')) {
        if (s.body.velocity.y < -50) {
            s.body.velocity.y = -50;            
        }
    }
    if (s.is('hJump')) {
        if (s.is('left')) {
            s.body.velocity.x = -90;
        } else {
            s.body.velocity.x = 90;
        }
    }
    if (s.body.velocity.y > 0 && s.isExclusiveDirection()) {
        s.grabEdge();
    }
    if (s.is('powerGrip')) {
        s.powerGrip();
    }
    return s;
};