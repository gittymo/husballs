class PlayerShield {
    constructor(playArea, rightEdgeOffsetPixels = 360, arcRadius = 240, lengthInDegrees = 40) {
        // if (!playArea instanceof PlayArea) throw "Invalid PlayArea object";
        // if (isNaN(arcRadius) || arcRadius < 100 || arcRadius > 400) throw "Invalid shield arc radius (" + arcRadius + ")";
        // if (isNaN(rightEdgeOffsetPixels)) throw "Invalid x-axis offset ratio for shield (" + rightEdgeOffsetPixels + ")";
        // if (isNaN(lengthInDegrees) || lengthInDegrees < 20) throw "Invalid arc length (" + lengthInDegrees + ")";
        this.playArea = playArea;
        this.x = playArea.width + (arcRadius - rightEdgeOffsetPixels);
        this.y = playArea.height / 2;
        this.arcRadius = arcRadius;
        const halfLengthInDegrees = lengthInDegrees / 2.0;
        this.bottomAngleDegrees = 180 + (90 - halfLengthInDegrees);
        this.lengthInDegrees = lengthInDegrees;
        this.momentumInDegrees = this.normalMomentumInDegrees = 5;
        this.targetBottomAngleDegrees = this.bottomAngleDegrees;
    }  

    move() {
        if (this.bottomAngleDegrees < this.targetBottomAngleDegrees) {
            this.bottomAngleDegrees += this.momentumInDegrees;
            if (this.bottomAngleDegrees > this.targetBottomAngleDegrees) this.bottomAngleDegrees = this.targetBottomAngleDegrees;
        }

        if (this.bottomAngleDegrees > this.targetBottomAngleDegrees) {
            this.bottomAngleDegrees -= this.momentumInDegrees;
            if (this.bottomAngleDegrees < this.targetBottomAngleDegrees) this.bottomAngleDegrees = this.targetBottomAngleDegrees;
        }
    }

    paint() {
        var ctx = this.playArea.ctx;
        ctx.strokeStyle = "black";
        ctx.lineWidth = 24;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.arc(this.x, 
                this.y, 
                this.arcRadius, 
                degreesToRadians(this.bottomAngleDegrees), 
                degreesToRadians(this.bottomAngleDegrees + this.lengthInDegrees));
        ctx.stroke();
    }

    setTargetAngle(distanceFromCenter) {
        if (!isNaN(distanceFromCenter)) {
            const halfLengthInDegrees = this.lengthInDegrees / 2.0;
            this.targetBottomAngleDegrees = Math.floor((270 - halfLengthInDegrees) - ((90 - halfLengthInDegrees) * distanceFromCenter));
        }
    }

    checkForCollisions() {
        var totalCollisions = 0;
        var totalOfCollisionAngles = 0;
        var ctx = this.playArea.ctx;
        
        for (var i = this.bottomAngleDegrees; i < this.bottomAngleDegrees + this.lengthInDegrees; i += 1) {
            const shieldPointVector = new Vector(this.arcRadius + 6, 0).rotate(i);
            const shieldPointX = this.x + shieldPointVector.xoffset;
            const shieldPointY = this.y + shieldPointVector.yoffset;
            
            for (var sri = 0; sri < this.playArea.spaceRocks.length; sri++) {
                var spaceRock = this.playArea.spaceRocks[sri];
                if (spaceRock != null && !spaceRock.playerHit) {
                    if (shieldPointX > spaceRock.x - spaceRock.radius && shieldPointX < spaceRock.x + spaceRock.radius &&
                        shieldPointY > spaceRock.y - spaceRock.radius && shieldPointY < spaceRock.y + spaceRock.radius) {
                        totalCollisions++;
                        totalOfCollisionAngles += i;
                        spaceRock.playerHit = true;
                        spaceRock.xspeed = -spaceRock.xspeed;
                    }
                }
            }
        }
    }
}