var Door = function (game, data) {
    var d   = this;
    d.g     = game;
    d.d     = data;
};

Door.prototype.create = function () {
    var d               = this;
    d.to                = {
        room: d.d.properties.room,
        door: d.d.properties.door
    };
    d.sprite            = d.g.add.sprite(d.d.x, d.d.y, 'door');
    d.g.physics.enable(d.sprite, Phaser.Physics.ARCADE);
    d.body              = d.sprite.body;
    d.body.immovable    = true
    d.body.setSize(32, 64, 16, 0);
    return d;
};