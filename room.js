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

Room.prototype.addBackgroundLayer = function () {
    var r       = this;
    r.l.bg      = r.g.add.tileSprite(
        0,
        0,
        r.t.widthInPixels,
        r.t.heightInPixels,
        r.t.images[0].properties.key
    );
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
    var r       = this;
    r.g.s.setPosition(r.t.objects.doors[doorIndex].x, r.t.objects.doors[doorIndex].y - 16, 'right');
    return r;
};

Room.prototype.addTilesetImages = function () {
    var r       = this;
    for (var i = r.t.tilesets.length - 1; i >= 0; i--) {
        r.t.addTilesetImage(r.t.tilesets[i].name);
    }
    return r;
};

Room.prototype.create = function () {
    var r       = this;
    r.tilemap   = r.g.add.tilemap(r.name);
    r.add
    r.t         = r.tilemap;
    r.layers    = {};
    r.l         = r.layers;
    r.addTilesetImages()
     .addBackgroundLayer()
     .addCollisionLayer()
     .addDecoLayer(2)
     .addPlayerLayer(0)
     .addDecoLayer(1);
    return r;
};

Room.prototype.setBackgroundPosition = function () {
    var r       = this;
    r.l.bg.tilePosition.x =
            Math.round(
                game.camera.position.x / 2
              - game.camera.width / 4
            )
          + r.t.images[0].x;
    r.l.bg.tilePosition.y =
            Math.round(
                game.camera.position.y / 2
              - game.camera.height / 4
            )
          + r.t.images[0].y;
    return r;
};

Room.prototype.update = function () {
    var r       = this;
    r.setBackgroundPosition();
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
    return r;
};
