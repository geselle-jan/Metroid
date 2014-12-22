var Map = function (game) {
    var m   = this;
    m.g     = game;
    m.d     = m.data;
    m.rooms = {};
    m.r     = 'sector01_room01';
    m.init();
};

Map.prototype.data = {
    rooms: [
        'sector01_room01',
        'sector01_room02',
        'sector01_room03',
        'sector01_room04',
        'sector01_room05',
        'sector01_room06',
        'sector01_room07',
        'sector01_room08',
        'debug'
    ],
    tilesets: [
        'collision',
        'debug',
        'yellow',
        'corridor1',
        'srx'
    ],
    backgrounds: [
        'debug_bg',
        'brown',
        'pipecorridor',
        'sr388cave',
        'greenpassage'
    ],
    animatedBackgrounds: {
        browntank: {
            frames: [0,1,2,3],
            fps: 4,
            width: 512,
            height: 256
        }
    },
    sprites: [
        'door',
    ]
};

Map.prototype.init = function () {
    var m   = this;
    for (var i = m.d.rooms.length - 1; i >= 0; i--) {
        m.rooms[m.d.rooms[i]] = new Room(m.g, m.d.rooms[i]);
        if (m.d.rooms[i] == m.r) {
            m.r = m.rooms[m.d.rooms[i]];
        }
    }
    return m;
};

Map.prototype.eachRoom = function (action) {
    var m   = this;
    for (room in m.rooms) {
        if (m.rooms.hasOwnProperty(room)) {
            m.rooms[room][action]();
        }
    }
    return m;
};

Map.prototype.loadAssets = function (type) {
    var m = this,
        asset;
    if (type == 'animatedBackgrounds') {
        for (asset in m.d[type]) {
            if (m.d[type].hasOwnProperty(asset)) {
                m.g.load.spritesheet(
                    asset,
                    'assets/' + type + '/' + asset +'.png',
                    m.d[type][asset].width,
                    m.d[type][asset].height
                );
            }
        }
    } else {
        for (var i = m.d[type].length - 1; i >= 0; i--) {
            m.g.load.image(
                m.d[type][i],
                'assets/' + type + '/' + m.d[type][i] +'.png'
            );
        }
    }
    return m;
};

Map.prototype.preload = function () {
    var m = this;
    m.eachRoom('preload')
     .loadAssets('tilesets')
     .loadAssets('backgrounds')
     .loadAssets('animatedBackgrounds')
     .loadAssets('sprites');
    return m;
};

Map.prototype.create = function (door) {
    var m = this;
    m.r.create(door);
    return m;
};

Map.prototype.update = function () {
    var m = this;
    m.r.update();
    return m;
};

Map.prototype.useDoorTo = function (room, door) {
    var m = this;
    m.r.destroy();
    m.r = m.rooms[room];
    m.create(door);
    return m;
};
