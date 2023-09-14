var baseFleetCraftSize = 8;
var baseFleetSpeed = 1;
var baseFleetRotateTime = 50;

class FleetCraft {
    constructor(playArea, xpos, ypos) {
        // if (!playArea instanceof PlayArea) throw "Invalid PlayArea object";
        /*if (isNaN(xpos) || isNaN(ypos)) {
            throw "Invalid fleet craft co-ordinate (" + xpos + ", " + ypos + ")";
        }*/
        this.playArea = playArea;
        this.x = xpos;
        this.y = ypos;
        this.horizontalMomentum = 0;
        this.verticalMomentum = 0;
        this.isHit = false;
        this.hitsLeft = 2;
        this.currentAngle = 0;
        this.destinationAngle = 0;
        this.originX = this.x;
        this.originY = this.y;
        this.rotateTime = baseFleetRotateTime * (3 + (Math.floor(Math.random() * 7)));
        this.moveState = 0;
        this.craftPaintObject = new VectorObject();
        this.alienPaintObject = new VectorObject();

        this.initPaintObjects();
    }

    initPaintObjects() {
        // Craft object (sans alien)
        this.craftPaintObject.addVector(-baseFleetCraftSize * 3, -baseFleetCraftSize);
        this.craftPaintObject.addVector(-baseFleetCraftSize * 2, -baseFleetCraftSize);
        for (var topArcAngle = 270; topArcAngle <= 450; topArcAngle += 30) {
            const topArcVector = new Vector(baseFleetCraftSize * 2, 0).rotate(topArcAngle).translate(0, -baseFleetCraftSize);
            this.craftPaintObject.addVector(topArcVector.xoffset, topArcVector.yoffset);
        }
        this.craftPaintObject.addVector(baseFleetCraftSize * 3, -baseFleetCraftSize);
        for (var rightArcAngle = 0; rightArcAngle <= 180; rightArcAngle += 45) {
            const rightArcVector = new Vector(baseFleetCraftSize, 0).rotate(rightArcAngle).translate(baseSpaceRockSpeed * 3, 0);
            this.craftPaintObject.addVector(rightArcVector.xoffset, rightArcVector.yoffset);
        }
        this.craftPaintObject.addVector(-baseFleetCraftSize * 3, baseFleetCraftSize);
        for (var leftArcAngle = 180; leftArcAngle <= 360; leftArcAngle += 45) {
            const leftArcVector = new Vector(baseFleetCraftSize, 0).rotate(leftArcAngle).translate(-baseFleetCraftSize * 3, 0);
            this.craftPaintObject.addVector(leftArcVector.xoffset, leftArcVector.yoffset);
        }
        this.craftPaintObject.addVector(baseFleetCraftSize * 3, -baseFleetCraftSize);

        // Alien object
        for (var topArcAngle = 270; topArcAngle <= 450; topArcAngle += 30) {
            const topArcVector = new Vector(baseFleetCraftSize, 0).rotate(topArcAngle).translate(0, -baseFleetCraftSize);
            this.alienPaintObject.addVector(topArcVector.xoffset, topArcVector.yoffset);
        }
        this.alienPaintObject.addVector(baseFleetCraftSize / 4, -baseFleetCraftSize * 2);
        const alienArielBaseX = baseFleetCraftSize / 2;
        const alienArielBaseY = -baseFleetCraftSize * 2.25;
        const alienArielTopRadius = baseFleetCraftSize / 4;
        this.alienPaintObject.addVector(alienArielBaseX, alienArielBaseY);
        this.alienPaintObject.addVector(alienArielBaseX - alienArielTopRadius, alienArielBaseY - alienArielTopRadius);
        this.alienPaintObject.addVector(alienArielBaseX, alienArielBaseY - (alienArielTopRadius * 2));
        this.alienPaintObject.addVector(alienArielBaseX + alienArielTopRadius, alienArielBaseY - alienArielTopRadius);
        this.alienPaintObject.addVector(alienArielBaseX, alienArielBaseY);
    }

    paint() {
       this.craftPaintObject.translate(this.x, this.y).stroke(this.playArea, 2);
       this.alienPaintObject.translate(this.x - (baseFleetCraftSize / 4), this.y).fill(this.playArea);    
    }

    move() {
        switch (this.moveState) {
            case 0 : {
                if (this.rotateTime > 0) {
                    this.rotateTime--;
                } else {
                    this.moveState = 1;
                    this.rotateAngle = 30 * (1 + (Math.floor(Math.random()  * 12)));
                    this.rotateEndAngle = this.rotateAngle + (30 * (1 + (Math.floor(Math.random()  * 12))));
                    this.rotateXRadius = 1 + (Math.floor(Math.random() * (baseFleetCraftSize / 2)));
                    this.rotateYRadius = Math.floor(Math.random() * (baseFleetCraftSize / 2));
                    const angleInRange = Math.floor(this.rotateAngle) % 360;
                    const xoffset = Math.floor((this.rotateXRadius * cosineTable[angleInRange]) - (this.rotateYRadius * sineTable[angleInRange]));
                    const yoffset = Math.floor((this.rotateXRadius * sineTable[angleInRange]) + (this.rotateYRadius * cosineTable[angleInRange]));
                    this.rotateStartX = this.originX + xoffset;
                    this.rotateStartY = this.originY + yoffset;
                }
            } break;
            case 1 : {
                if (this.x < this.rotateStartX) {
                    this.x++;
                } else if (this.x > this.rotateStartX) {
                    this.x--;
                }
                if (this.y < this.rotateStartY) {
                    this.y++;
                } else if (this.y > this.rotateStartY) {
                    this.y--;
                }
                if (this.x == this.rotateStartX && this.y == this.rotateStartY) {
                    this.moveState = 2;
                }
            } break;
            case 2 : {
                const angleInRange = Math.floor(this.rotateAngle) % 360;
                const xoffset = Math.floor((this.rotateXRadius * cosineTable[angleInRange]) - (this.rotateYRadius * sineTable[angleInRange]));
                const yoffset = Math.floor((this.rotateXRadius * sineTable[angleInRange]) + (this.rotateYRadius * cosineTable[angleInRange]));
                this.x = this.originX + xoffset;
                this.y = this.originY + yoffset;
                this.rotateAngle += 10;
                if (this.rotateAngle >= this.rotateEndAngle) {
                    this.moveState = 3;
                }
            } break;
            case 3 : {
                if (this.x < this.originX) {
                    this.x++;
                } else if (this.x > this.originX) {
                    this.x--;
                }
                if (this.y < this.originY) {
                    this.y++;
                } else if (this.y > this.originY) {
                    this.y--;
                }
                if (this.x == this.originX && this.y == this.originY) {
                    this.moveState = 0;
                    this.rotateTime = baseFleetRotateTime * (3 + (Math.floor(Math.random() * 7)));
                }
            }
        }
    }
}