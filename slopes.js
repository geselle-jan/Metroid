/* global Phaser */
(function () {
    'use strict';
    Phaser.Physics.Arcade.Body.prototype.velocityPunish = new Phaser.Point(0, 0);

    Phaser.Physics.Arcade.isPointInTriangle = function ( px, py, ax, ay, bx, by, cx, cy) {

        var v0 = [cx-ax,cy-ay];
        var v1 = [bx-ax,by-ay];
        var v2 = [px-ax,py-ay];

        var dot00 = (v0[0]*v0[0]) + (v0[1]*v0[1]);
        var dot01 = (v0[0]*v1[0]) + (v0[1]*v1[1]);
        var dot02 = (v0[0]*v2[0]) + (v0[1]*v2[1]);
        var dot11 = (v1[0]*v1[0]) + (v1[1]*v1[1]);
        var dot12 = (v1[0]*v2[0]) + (v1[1]*v2[1]);

        var invDenom = 1/ (dot00 * dot11 - dot01 * dot01);

        var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
        var v = (dot00 * dot12 - dot01 * dot02) * invDenom;

        return ((u >= 0) && (v >= 0) && (u + v < 1));
    };

    Phaser.Physics.Arcade.prototype.collideSpriteVsTilemapLayer = function (sprite, tilemapLayer, collideCallback, processCallback, callbackContext) {
        if (!sprite.body) {
            return;
        }

        this._mapData = tilemapLayer.getTiles(
            sprite.body.position.x,
            sprite.body.position.y,
            sprite.body.width,
            sprite.body.height,
            false, false);

        if (this._mapData.length === 0) {
            return;
        }

        for (var i = 0, tile, _slope, slopeFunction; i < this._mapData.length; i += 1) {
            tile = this._mapData[i];

            if (tile.hasOwnProperty('slopeFunction')) {
                slopeFunction = tile.slopeFunction;
            } else {
                _slope = tile.hasOwnProperty('slope') ? tile.slope : Phaser.Physics.Arcade.FULL_SQUARE;
                if (!Phaser.Physics.Arcade.SLOPEMAP.hasOwnProperty(_slope))
                {
                    _slope = 'FULL_SQUARE';

                }
                slopeFunction = Phaser.Physics.Arcade.SLOPEMAP[_slope];
            }


            //if (this.separateTile(i, sprite.body, tile))
            if (slopeFunction.call(this, i, sprite.body, tile)) {
                //  They collided, is there a custom process callback?
                if (processCallback) {
                    if (processCallback.call(callbackContext, sprite, this._mapData[i])) {
                        this._total += 1;

                        if (collideCallback) {
                            collideCallback.call(callbackContext, sprite, this._mapData[i]);
                        }
                    }
                } else {
                    this._total += 1;

                    if (collideCallback) {
                        collideCallback.call(callbackContext, sprite, this._mapData[i]);
                    }
                }
            }
        }
    };


    // Slope tile functions

    Phaser.Physics.Arcade._collisionFullSquare = function (i, body, tile) {
        var collides = this.separateTile(i, body, tile);
        if (collides) {
            body.velocityPunish.x = 0;
        }
        body.y = Math.ceil(body.position.y);
        return collides;
    };


    Phaser.Physics.Arcade.halfRectangleTop = function(i, body, tile){
        // check intersection
        /*var intersects = (body.bottom.right <= tile.worldX);
        intersects = intersects || (body.bottom <= tile.worldY + (tile.height / 2));
        intersects = intersects || (body.position.x >= tile.worldX + tile.width);
        intersects = intersects || (body.position.y >= tile.worldY + (tile.height / 2)); */
        var intersects = (body.bottom.right <= tile.worldX);
        intersects = intersects || (body.bottom <= tile.worldY + (tile.height / 2));
        intersects = intersects || (body.position.x >= tile.worldX + tile.width);
        intersects = intersects || (body.position.y >= tile.worldY);
        if (!intersects) {
            return intersects;
        }


        this.tileCheckX(body, tile);
        /*
        var ox=0;
        if (!body.blocked.right && body.deltaAbsX() > 0) {
            ox = body.right - tile.left;
        } else if (!body.blocked.left && body.deltaAbsX() < 0) {
            ox = body.x - tile.right;
        }

        if (this.TILE_BIAS < Math.abs(ox)) {
            ox=0;
        }
        
        if(ox !== 0){
            this.processTileSeparationX(body, ox);
        }
    */
        var oy = 0;
        
        if (body.deltaY() < 0 && !body.blocked.up) {
            //  Body is moving UP
            if (tile.faceBottom && body.y < tile.bottom) {
                oy = body.y - tile.bottom + (tile.height / 2);

                if (oy < -this.TILE_BIAS) {
                    oy = 0;
                }
            }
        } else if (body.deltaY() > 0 && !body.blocked.down && tile.collideUp && body.checkCollision.down) {
            //  Body is moving DOWN

            if (tile.faceTop && body.bottom > tile.top) {
                oy = body.bottom - tile.top;

                if (oy > this.TILE_BIAS) {
                    oy = 0;
                }
            }
        }

        if (oy !== 0) {
            this.processTileSeparationY(body, oy);
        }

    };


    Phaser.Physics.Arcade._collisionHalfTriangleBottomLeft = function (i, body, tile) {
        /*
          .__
          |  |
        a |  |
        |\p__|
        | \
        |__\
        c   b

        */
        var collides = Phaser.Physics.Arcade.isPointInTriangle(
            body.position.x,                // px
            body.position.y + body.height,  // py
            tile.worldX - tile.width,       // ax
            tile.worldY - tile.height,      // ay
            tile.worldX + (tile.width * 2), // bx
            tile.worldY + (tile.height * 2),// by
            tile.worldX - tile.width,       // cx
            tile.worldY + (tile.height * 2) // cy
        );
        if ((body.sticky || collides) && body.position.x >= tile.worldX) {
            body.y = tile.worldY - body.height + (body.position.x - tile.worldX);
            if (body.y < tile.worldY - body.height) {
                body.y = tile.worldY - body.height;
            }
            if (body.y > tile.worldY + tile.height - body.height) {
                body.y = tile.worldY + tile.height - body.height;
            }
            body.velocity.y = 500;
            body.blocked.down = true;
            return false;
        }
        return true;
    };

    Phaser.Physics.Arcade._collisionHalfTriangleBottomRight = function (i, body, tile) {
        /*
      .__
      |  |
      |  | a
      |__p/|
         / |
        /__|
        c  b

        */
        var collides = Phaser.Physics.Arcade.isPointInTriangle(
            body.position.x + body.width,   // px
            body.position.y + body.height,  // py
            tile.worldX + (tile.width * 2), // ax
            tile.worldY - tile.height,      // ay
            tile.worldX + (tile.width * 2), // bx
            tile.worldY + (tile.height * 2),// by
            tile.worldX - tile.width,       // cx
            tile.worldY + (tile.height * 2) // cy
        );
        if ((body.sticky || collides) && body.position.x + body.width <= tile.worldX + tile.width) {
            body.y = tile.worldY - body.height + (((body.position.x + body.width) - tile.worldX) * -1 + tile.height);
            if (body.y < tile.worldY - body.height ) {
                body.y = tile.worldY - body.height;
            }
            if (body.y > tile.worldY + tile.height - body.height ) {
                body.y = tile.worldY + tile.height - body.height;
            }
            body.velocity.y = 500;
            body.blocked.down = true;
            return false;
        }
        return true;
    };

    Phaser.Physics.Arcade._collisionLongTriangleBottomRightLow = function (i, body, tile) {
        /*       a
      .__       /|
      |  |     / |
      |  |    /  |
      |__p/|  |  |
         / |  |  |
        /__|  |__|
        c        b

        */
        var collides = Phaser.Physics.Arcade.isPointInTriangle(
            body.position.x + body.width,   // px
            body.position.y + body.height,  // py
            tile.worldX + (tile.width * 4), // ax
            tile.worldY - tile.height,      // ay
            tile.worldX + (tile.width * 4), // bx
            tile.worldY + (tile.height * 2),// by
            tile.worldX - (tile.width * 2), // cx
            tile.worldY + (tile.height * 2) // cy
        );

        if ((body.sticky || collides) && body.position.x + body.width <= tile.worldX + tile.width) {
            body.y = tile.worldY - body.height + (((body.position.x + body.width) - tile.worldX) * -0.5 + tile.height);
            if (body.y < tile.worldY - body.height ) {
                body.y = tile.worldY - body.height;
            }
            if (body.y > tile.worldY + tile.height - body.height ) {
                body.y = tile.worldY + tile.height - body.height;
            }
            body.velocity.y = 500;
            body.blocked.down = true;
            return false;
        }
        return true;
    };

    Phaser.Physics.Arcade._collisionLongTriangleBottomRightHigh = function (i, body, tile) {
        /*
            .__
            |  |
            |  | a
            |__p/|
               / |
              /  |
          /|  |  |
         / |  |  |
        /__|  |__|
        c        b

        */
        var collides = Phaser.Physics.Arcade.isPointInTriangle(
            body.position.x + body.width,   // px
            body.position.y + body.height,  // py
            tile.worldX + (tile.width * 3), // ax
            tile.worldY - tile.height,      // ay
            tile.worldX + (tile.width * 3), // bx
            tile.worldY + (tile.height * 2),// by
            tile.worldX - (tile.width * 3), // cx
            tile.worldY + (tile.height * 2) // cy
        );

        if ((body.sticky || collides) && body.position.x + body.width <= tile.worldX + tile.width) {
            body.y = tile.worldY - body.height + (((body.position.x + body.width) - tile.worldX) * -0.5 + tile.height * 0.5);
            if (body.y < tile.worldY - body.height ) {
                body.y = tile.worldY - body.height;
            }
            if (body.y > tile.worldY + tile.height - body.height ) {
                body.y = tile.worldY + tile.height - body.height;
            }
            body.velocity.y = 500;
            body.blocked.down = true;
            return false;
        }
        return true;
    };

    Phaser.Physics.Arcade._collisionLongTriangleBottomLeftLow = function (i, body, tile) {
        /*
        a
        |\      .__
        | \     |  |
        |  \    |  |
        |  |  |\p__|
        |  |  | \
        |__|  |__\
        c         b

        */
        var collides = Phaser.Physics.Arcade.isPointInTriangle(
            body.position.x,                // px
            body.position.y + body.height,  // py
            tile.worldX - (tile.width*3),   // ax
            tile.worldY - tile.height,      // ay
            tile.worldX + (tile.width * 3), // bx
            tile.worldY + (tile.height * 2),// by
            tile.worldX - (tile.width * 3), // cx
            tile.worldY + (tile.height * 2) // cy
        );
        if ((body.sticky || collides) && body.position.x >= tile.worldX) {
            body.y = tile.worldY - body.height + (body.position.x - tile.worldX) * 0.5 + tile.height * 0.5;
            if (body.y < tile.worldY - body.height) {
                body.y = tile.worldY - body.height;
            }
            if (body.y > tile.worldY + tile.height - body.height) {
                body.y = tile.worldY + tile.height - body.height;
            }
            body.velocity.y = 500;
            body.blocked.down = true;
            return false;
        }
        return true;
    };

    Phaser.Physics.Arcade._collisionLongTriangleBottomLeftHigh = function (i, body, tile) {
        /*
          .__
          |  |
        a |  |
        |\p__|
        | \
        |  \
        |  |  |\
        |  |  | \
        |__|  |__\
        c         b

        */
        var collides = Phaser.Physics.Arcade.isPointInTriangle(
            body.position.x,                // px
            body.position.y + body.height,  // py
            tile.worldX - (tile.width*2),   // ax
            tile.worldY - tile.height,      // ay
            tile.worldX + (tile.width * 4), // bx
            tile.worldY + (tile.height * 2),// by
            tile.worldX - (tile.width * 4), // cx
            tile.worldY + (tile.height * 2) // cy
        );
        if ((body.sticky || collides) && body.position.x >= tile.worldX) {
            body.y = tile.worldY - body.height + (body.position.x - tile.worldX) * 0.5;
            if (body.y < tile.worldY - body.height) {
                body.y = tile.worldY - body.height;
            }
            if (body.y > tile.worldY + tile.height - body.height) {
                body.y = tile.worldY + tile.height - body.height;
            }
            body.velocity.y = 500;
            body.blocked.down = true;
            return false;
        }
        return true;
    };

    Phaser.Physics.Arcade._collisionRectangleBottom = function (i, body, tile) {
        var intersects = (body.position.x >= tile.worldX && body.position.x <=  tile.worldX + tile.width);
        
        if (intersects){
            // falling
            if(body.velocity.y > 0 && (body.bottom >= tile.worldY + tile.height / 2)){
                body.position.y = tile.worldY - tile.height / 2;
                body.blocked.down = true;
            } else {
                body.position.y = tile.worldY + tile.height;
                body.velocity.y=0;
            }
        }
    }
    

    Phaser.Physics.Arcade._collisionSquareBottomLeft = function (i, body, tile) {
        var intersects = (body.position.x + body.halfWidth >= tile.worldX && body.position.x <=  tile.worldX + tile.width);
        
        if (intersects){
            // falling
            if(body.velocity.y > 0 && (body.bottom >= tile.worldY + tile.height / 2)){
                body.position.y = tile.worldY - tile.height / 2;
                body.blocked.down = true;
            } else {
                body.position.y = tile.worldY + tile.height;
                body.velocity.y=0;
            }
        }
    }
    

    Phaser.Physics.Arcade.SLOPEMAP = {
        'FULL_SQUARE': Phaser.Physics.Arcade._collisionFullSquare,
        'HALF_TRIANGLE_BOTTOM_LEFT': Phaser.Physics.Arcade._collisionHalfTriangleBottomLeft,
        'HALF_TRIANGLE_BOTTOM_RIGHT': Phaser.Physics.Arcade._collisionHalfTriangleBottomRight,
        'LONG_TRIANGLE_BOTTOM_RIGHT_LOW': Phaser.Physics.Arcade._collisionLongTriangleBottomRightLow,
        'LONG_TRIANGLE_BOTTOM_RIGHT_HIGH': Phaser.Physics.Arcade._collisionLongTriangleBottomRightHigh,
        'LONG_TRIANGLE_BOTTOM_LEFT_LOW': Phaser.Physics.Arcade._collisionLongTriangleBottomLeftLow,
        'LONG_TRIANGLE_BOTTOM_LEFT_HIGH': Phaser.Physics.Arcade._collisionLongTriangleBottomLeftHigh,
        'RECTANGLE_BOTTOM': Phaser.Physics.Arcade._collisionRectangleBottom,
    };


})();