var baseSpaceRockRadius = 16;
var baseSpaceRockSpeed = 8;

class SpaceRock {
    constructor(playArea) {
        if (!playArea instanceof PlayArea) throw "Invalid play area.";
        this.playArea = playArea;
        this.reinit();
    }

    move() {
        if (this.playArea.gameStarted) {
            this.x += this.xspeed;
            this.y += this.yspeed;
            this.rotationAngle += this.rotationSpeedDegrees;
            if (this.rotationAngle >= 360) {
                this.rotationAngle -= 360;
            }
            if (this.rotationAngle < 0) {
                this.rotationAngle += 360;
            }
            if (this.y < 0 - this.radius || this.y > this.playArea.height + this.radius) {
                if (!this.playerHit) {
                    this.yspeed = -this.yspeed;
                } else {
                    this.reinit();
                }
            }
            if (this.x + this.radius < 0 && this.playerHit) {
                this.reinit();
            }
            if (this.x > this.playArea.width + (this.radius * 8)) {
                const radius = this.baseRadius * (1 + Math.floor(Math.random() * 4));
                const xspeed = 4 + (Math.floor(Math.random() * 4));
                const yspeed = -8 + (Math.floor(Math.random() * 16));
                this.reinit(radius, xspeed, yspeed);
            }
        }
    }

    paint() {
        var ctx = this.playArea.ctx;
        this.paintObject.rotateAndTranslate(Math.floor(this.rotationAngle), this.x, this.y).fill(this.playArea);
    }

    reinit() {
        this.radius = baseSpaceRockRadius * (1 + Math.floor(Math.random() * 4));
        this.xspeed = 4 + (1 + (Math.floor(Math.random() * baseSpaceRockSpeed)));
        this.yspeed = -baseSpaceRockSpeed + (Math.floor(Math.random() * (2 * baseSpaceRockSpeed)));
        this.playerHit = false;
        this.rotationSpeedDegrees = -2 + (Math.random() * 4);
        this.rotationAngle = Math.floor(Math.random() * 360);
        this.x = -this.radius * 8;
        this.y = Math.floor((this.radius * 4) + (Math.random() * (this.playArea.height - (this.radius * 8))));

        this.paintObject = new VectorObject();
        var degrees = 0;
        var edgeRadius = this.radius;
        const edgeChangeRadius = this.radius / 16;
        var diff = [1.0, 0.0, 0.0, -1.0];
        while (degrees < 360) {
            var changeDir = -1 + Math.floor(Math.random() * 3);
            for (var i = 0; i < diff.length && degrees < 360; i++) {
                var radians = degreesToRadians(degrees);
                var vector = new Vector(0, edgeRadius + Math.floor(edgeChangeRadius * diff[i])).rotate(degrees);
                this.paintObject.addVector(vector.xoffset, vector.yoffset); 
                degrees += (1 + Math.floor(Math.random() * 2)) * 15;
            }
            edgeRadius += edgeChangeRadius * changeDir;
            if (edgeRadius < this.radius) {
                edgeRadius = this.radius;
            }
            if (edgeRadius > this.radius * 4) {
                edgeRadius = this.radius * 4;
            }
        }
    }
}