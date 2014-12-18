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
        'srx2',
        'srx3'
    ],
    tilesets: [
        'collision',
        'yellow',
        'corridor1',
        'srx'
    ],
    backgrounds: [
        'brown',
        'browntank',
        'pipecorridor',
        'sr388cave'
    ],
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
    var m = this;
    for (var i = m.d[type].length - 1; i >= 0; i--) {
        m.g.load.image(
            m.d[type][i],
            'assets/' + type + '/' + m.d[type][i] +'.png'
        );
    }
    return m;
};

Map.prototype.preload = function () {
    var m = this;
    m.eachRoom('preload')
     .loadAssets('tilesets')
     .loadAssets('backgrounds')
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
