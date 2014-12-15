var Samus = function (game) {
	var s			= this,
		now			= new Date();	
	s.g 			= game;
	s.b				= {
		up:		{},
		down:	{},
		left:	{},
		right:	{},
		a:		{},
		b:		{},
		l:		{},
		r:		{},
		start:	{},
		select:	{}
	};
	s.state			= {
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
	s.animations	= [
		{
			name: 	'standLeft',
			fps: 	3,
			loop: 	true,
			frames:	[18, 17, 16]
		},
		{
			name: 	'standRight',
			fps: 	3,
			loop: 	true,
			frames:	[21, 22, 23]
		},
		{
			name: 	'turnLeft',
			fps: 	20,
			loop: 	false,
			frames:	[20, 19]
		},
		{
			name: 	'turnRight',
			fps: 	20,
			loop: 	false,
			frames:	[19, 20]
		},
		{
			name: 	'walkLeft',
			fps: 	20,
			loop: 	true,
			frames:	[51, 50, 49, 48, 59, 58, 57, 56, 67, 66]
		},
		{
			name: 	'walkRight',
			fps: 	20,
			loop: 	true,
			frames:	[52, 53, 54, 55, 60, 61, 62, 63, 68, 69]
		},
		{
			name: 	'hJumpLeft',
			fps: 	30,
			loop: 	true,
			frames:	[259, 258, 257, 256, 267, 266, 265, 264]
		},
		{
			name: 	'hJumpRight',
			fps: 	30,
			loop: 	true,
			frames:	[260, 261, 262, 263, 268, 269, 270, 271]
		},
		{
			name: 	'powerGripLeft',
			fps: 	3,
			loop: 	true,
			frames:	[329, 330, 331, 330]
		},
		{
			name: 	'powerGripRight',
			fps: 	3,
			loop: 	true,
			frames:	[332, 333, 334, 333]
		}
	];
};

Samus.prototype.preload = function () {
	var s	= this;
	s.g.load.spritesheet('samus', 'assets/samus.png', 50, 50);
	return s;
};

Samus.prototype.addAnimations = function () {
	var s	= this;
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
	var s	= this;
	s.b.up		= s.g.input.keyboard.addKey(
		Phaser.Keyboard.W
	);
	s.b.down	= s.g.input.keyboard.addKey(
		Phaser.Keyboard.S
	);
	s.b.left	= s.g.input.keyboard.addKey(
		Phaser.Keyboard.A
	);
	s.b.right	= s.g.input.keyboard.addKey(
		Phaser.Keyboard.D
	);
	s.b.a		= s.g.input.keyboard.addKey(
		Phaser.Keyboard.UP
	);
	s.b.b		= s.g.input.keyboard.addKey(
		Phaser.Keyboard.LEFT
	);
	s.b.l		= s.g.input.keyboard.addKey(
		Phaser.Keyboard.SHIFT
	);
	s.b.r		= s.g.input.keyboard.addKey(
		Phaser.Keyboard.SPACEBAR
	);
	s.b.select	= s.g.input.keyboard.addKey(
		Phaser.Keyboard.BACKSPACE
	);
	s.b.start	= s.g.input.keyboard.addKey(
		Phaser.Keyboard.ENTER
	);
	return s;
};

Samus.prototype.create = function (x, y) {
	var s						= this;
    s.sprite 					= s.g.add.sprite(x, y -19, 'samus');
    s.g.physics.enable(s.sprite, Phaser.Physics.ARCADE);
    s.body						= s.sprite.body;
    s.body.bounce.y				= 0;
    s.body.gravity.y 			= 1500;
    s.body.collideWorldBounds	= true;
    s.body.setSize(16, 32, 17, 14);
    s.g.camera.follow(s.sprite);
    s.addAnimations();
    s.defineButtons();
    s.set('right', true);
    s.sprite.animations.play('standRight');
	return s;
};

Samus.prototype.get = function (state, expected, since) {
	var s	= this,
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
	var s	= this;
	return s.get(state, true, since);
};

Samus.prototype.isnt = function (state, since) {
	var s	= this;
	return s.get(state, false, since);
};

Samus.prototype.set = function (state, value) {
	var s	= this,
		now	= new Date();
	s.state[state].is		= value;
	s.state[state].since	= now;
	return s;
};

Samus.prototype.update = function (collisionLayer) {
	var s	= this;
	s.g.physics.arcade.collide(s.sprite, collisionLayer);
	s.updateMovement();
	return s;
};

Samus.prototype.isOnGround = function () {
	var s	= this;
	return s.isnt('vJump') && s.isnt('hJump');
};

Samus.prototype.isAnimFinished = function () {
	var s	= this;
	return s.sprite.animations.currentAnim.isFinished;
};

Samus.prototype.isAnim = function (name) {
	var s	= this;
	return s.sprite.animations.currentAnim.name == name;
};

Samus.prototype.isntAnim = function (name) {
	var s	= this;
	return !s.isAnim(name);
};

Samus.prototype.isExclusiveDirection = function () {
	var s	= this;
	return (
		(s.b.left.isDown && !s.b.right.isDown)
		||
		(s.b.right.isDown && !s.b.left.isDown)
	);
};

Samus.prototype.standLeft = function () {
	var s	= this;
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
	var s	= this;
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
	var s	= this;
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
	var s	= this;
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

Samus.prototype.updateMovement = function () {
	var s	= this;
	if (s.isOnGround()) {
		if (s.isExclusiveDirection()) {
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
	return s;
};