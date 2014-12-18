var game    = new Phaser.Game(240, 160, Phaser.CANVAS, 'metroid', { preload: preload, create: create, update: update, render: render }, false, false),
    g       = game,
    samus   = new Samus(game),
    map     = new Map(game);
    g.s     = samus;
    g.m     = map;


function preload() {

    map.preload();
    samus.preload();

}

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.stage.backgroundColor = '#000000';

    samus.create();
    map.create();

}

function update() {
    if (samus.sprite.position.x >= map.r.t.widthInPixels - 34) {
        test();
    }

    map.update();
    samus.update();
}

function render () {

    // game.debug.text(game.time.physicsElapsed, 32, 32);
    // game.debug.body(player);
    // game.debug.bodyInfo(player, 16, 24);
}

function test () {
    map.r.destroy();
    map.r = map.rooms.srx1;
    map.create();
}