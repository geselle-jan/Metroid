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

var tileset,
    deco1,
    deco2,
    bg;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#000000';

    bg = game.add.tileSprite(0, 0, 480, 320, 'sr388cave');
    bg.fixedToCamera = true;

    g.map = game.add.tilemap('srx1');

    g.map.addTilesetImage('collision');

    g.collisionLayer = g.map.createLayer('collision');

    g.collisionLayer.layer.data.forEach(function(e){
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

    g.map.setCollision([1,2,3,4,5,6,7]);

    g.collisionLayer.resizeWorld();
    g.collisionLayer.visible = false


    g.map.addTilesetImage('srx');
    deco2 = g.map.createLayer('deco2');

    samus.create(g.map.objects.doors[0].x, g.map.objects.doors[0].y);

    deco1 = g.map.createLayer('deco1');

}

function update() {

    bg.tilePosition.x = Math.round(game.camera.position.x / -2);
    bg.tilePosition.y = Math.round(game.camera.position.y / -2);

    samus.update(g.collisionLayer);
}

function render () {

    // game.debug.text(game.time.physicsElapsed, 32, 32);
    // game.debug.body(player);
    // game.debug.bodyInfo(player, 16, 24);
}