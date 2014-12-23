var Room = function (game, name) {
    var r       = this;
    r.g         = game;
    r.name      = name;
};

Room.prototype.preload = function () {
    var r   = this;
    r.g.load.tilemap(
        r.name,
        'assets/rooms/' + r.name + '.json',
        null,
        Phaser.Tilemap.TILED_JSON
    );
    return r;
};

Room.prototype.addStaticBackgroundLayer = function () {
    var r   = this;
    r.l.bg  = r.g.add.tileSprite(
        0,
        0,
        r.t.widthInPixels,
        r.t.heightInPixels,
        r.t.images[0].properties.key
    );
    return r;
};

Room.prototype.addAnimatedBackgroundLayer = function () {
    var r   = this,
        key = r.t.images[0].properties.key;
    r.l.bg  = r.g.add.sprite(0, 0, key);
    r.addBackgroundAnimation();
    r.l.bg.animations.play('bgLoop');
    return r;
};

Room.prototype.addBackgroundAnimation = function () {
    var r   = this,
        key = r.t.images[0].properties.key,
        obj = r.g.m.d['animatedBackgrounds'][key];
    r.l.bg.animations.add(
        'bgLoop',
        obj.frames,
        obj.fps,
        true
    );
    return r;
};

Room.prototype.addBackgroundLayer = function () {
    var r   = this,
        key = r.t.images[0].properties.key,
        asset,
        animated = false;
    for (asset in r.g.m.d['animatedBackgrounds']) {
        if (r.g.m.d['animatedBackgrounds'].hasOwnProperty(asset)) {
            if (asset == key) {
                animated = true;
            }
        }
    }
    if (animated) {
        r.addAnimatedBackgroundLayer();
    } else {
        r.addStaticBackgroundLayer();
    }
    r.l.bg.animated = animated;
    return r;
};

Room.prototype.addCollisionLayer = function () {
    var r = this;
    r.t.addTilesetImage('collision');
    r.l.collision = r.t.createLayer('collision');
    r.l.collision.layer.data.forEach(function(e){
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
            } else {
                //console.log(t.index);
            }
        });
    });
    r.t.setCollision([1,2,3,4,5,6,7]);
    r.l.collision.resizeWorld();
    r.l.collision.visible = false;
    return r;
};

Room.prototype.addDecoLayer = function (number) {
    var r       = this;
    r.l['deco'+number] = r.t.createLayer('deco'+number);
    return r;
};

Room.prototype.addPlayerLayer = function (doorIndex) {
    var r = this,
        s = r.g.s;
    if (doorIndex == 0) {
        s.setPosition(
            r.t.objects.doors[doorIndex].x,
            r.t.objects.doors[doorIndex].y - 16,
            'right'
        );
    } else {
        if (s.is('right')) {
            s.setPosition(
                r.d[doorIndex].d.x + 64 + 8,
                r.d[doorIndex].d.y + 64 - s.body.height,
                'right'
            );
        } else {
            s.setPosition(
                r.d[doorIndex].d.x - 8 - s.body.width,
                r.d[doorIndex].d.y + 64 - s.body.height,
                'left'
            );
        }
    }
    return r;
};

Room.prototype.addTilesetImages = function () {
    var r       = this;
    for (var i = r.t.tilesets.length - 1; i >= 0; i--) {
        r.t.addTilesetImage(r.t.tilesets[i].name);
    }
    return r;
};

Room.prototype.addDoors = function () {
    var r       = this,
        doors   = r.t.objects.doors;
    for (var i = doors.length - 1; i >= 0; i--) {
        if (doors[i].type == 'door') {
            r.d[doors[i].name] = new Door(r.g, doors[i]);
            r.d[doors[i].name].create();
        }
    }
    return r;
};

Room.prototype.bringDoorsToTop = function () {
    var r       = this,
        door;
    for (door in r.d) {
        if (r.d.hasOwnProperty(door)) {
            r.d[door].sprite.bringToTop();
        }
    }
    return r;
};

Room.prototype.detroyDoors = function () {
    var r       = this,
        door;
    for (door in r.d) {
        if (r.d.hasOwnProperty(door)) {
            r.d[door].sprite.destroy();
        }
    }
    return r;
};

Room.prototype.create = function (door) {
    var r       = this;
    r.tilemap   = r.g.add.tilemap(r.name);
    r.t         = r.tilemap;
    r.layers    = {};
    r.l         = r.layers;
    r.doors     = {};
    r.d         = r.doors;
    if (typeof door == 'undefined') {
        door = 0;
    }
    r.addTilesetImages()
     .addDoors()
     .addBackgroundLayer()
     .addCollisionLayer()
     .addDecoLayer(2)
     .addPlayerLayer(door)
     .addDecoLayer(1)
     .bringDoorsToTop();
    return r;
};

Room.prototype.setBackgroundPosition = function () {
    var r       = this,
        x,
        y;
    if (!r.t.images[0].properties.fixed) {
        x =
            Math.round(
                game.camera.position.x / 2
              - game.camera.width / 4
            )
          + r.t.images[0].x;
        y =
            Math.round(
                game.camera.position.y / 2
              - game.camera.height / 4
            )
          + r.t.images[0].y;
        if (r.l.bg.animated) {
            r.l.bg.position.x = x;
            r.l.bg.position.y = y;
        } else {
            r.l.bg.tilePosition.x = x;
            r.l.bg.tilePosition.y = y;
        }
    }
    return r;
};

Room.prototype.checkDoorCollision = function () {
    var r = this,
        door;
    for (door in r.d) {
        if (r.d.hasOwnProperty(door)) {
            if (Phaser.Rectangle.intersects(
                g.s.body,
                r.d[door].body
            )) {
                r.g.m.useDoorTo(
                    r.d[door].to.room,
                    r.d[door].to.door
                )
            }
        }
    }
    return r;
};

Room.prototype.update = function () {
    var r       = this;
    if (g.m.r === r) {
        r.setBackgroundPosition()
         .checkDoorCollision();
    }
    return r;
};

Room.prototype.destroy = function () {
    var r = this,
        layer;
    for (layer in r.l) {
        if (r.l.hasOwnProperty(layer)) {
            r.l[layer].destroy();
        }
    }
    r.detroyDoors();
    return r;
};
