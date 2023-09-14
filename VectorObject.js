class VectorObject {
    constructor() {
        this.vectors = [];
        this.vectorIndex = 0;
    }

    addVector(xpos, ypos) {
        // if (isNaN(xpos) || isNaN(ypos)) throw "Invalid vector (" + xpos + ", " + ypos + ")";
        this.vectors[this.vectorIndex++] = new Vector(xpos, ypos);
    }

    rotateAndTranslate(degrees, originX, originY) {
        if (isNaN(degrees)) degrees = 0;
        degrees -= 90;
        if (degrees < 0) {
            degrees = 360 + (degrees % 360);
        } else if (degrees >= 360) {
            degrees = degrees % 360;
        }

        var transformedVectorObject = new VectorObject();
        for (var vectorIndex = 0; vectorIndex < this.vectors.length; vectorIndex++) {
            const vector = this.vectors[vectorIndex];
            const new_xoffset = originX + Math.floor((vector.xoffset * cosineTable[degrees]) - (vector.yoffset * sineTable[degrees]));
            const new_yoffset = originY + Math.floor((vector.xoffset * sineTable[degrees]) + (vector.yoffset * cosineTable[degrees]));
            transformedVectorObject.addVector(new_xoffset, new_yoffset);
        }
        return transformedVectorObject;
    }
    
    rotate(degrees) {
        if (isNaN(degrees)) degrees = 0;
        degrees -= 90;
        if (degrees < 0) {
            degrees = 360 + (degrees % 360);
        } else if (degrees > 360) {
            degrees = degrees % 360;
        }

        var transformedVectorObject = new VectorObject();
        for (var vectorIndex = 0; vectorIndex < this.vectors.length; vectorIndex++) {
            const vector = this.vectors[vectorIndex];
            const new_xoffset = Math.floor((vector.xoffset * cosineTable[degrees]) - (vector.yoffset * sineTable[degrees]));
            const new_yoffset = Math.floor((vector.xoffset * sineTable[degrees]) + (vector.yoffset * cosineTable[degrees]));
            transformedVectorObject.addVector(new_xoffset, new_yoffset);
        }
        return transformedVectorObject;
    }

    translate(originX, originY) {
        var transformedVectorObject = new VectorObject();
        for (var vectorIndex = 0; vectorIndex < this.vectors.length; vectorIndex++) {
            const vector = this.vectors[vectorIndex];
            transformedVectorObject.addVector(originX + vector.xoffset, originY + vector.yoffset);
        }
        return transformedVectorObject;
    }

    stroke(playArea, lineWidth = 1, color = "black") {
        var ctx = playArea.ctx;
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
        ctx.beginPath();
        var zeroVectorHits = 0;
        var vectorIndex = 0;
        while (zeroVectorHits < 2) {
            const vector = this.vectors[vectorIndex];
            if (vectorIndex == 0) {
                if (zeroVectorHits == 0) {
                    ctx.moveTo(vector.xoffset, vector.yoffset);
                } else {
                    ctx.lineTo(vector.xoffset, vector.yoffset);
                }
                zeroVectorHits++;
            } else {
                ctx.lineTo(vector.xoffset, vector.yoffset);
            }
            vectorIndex = (vectorIndex + 1) % this.vectors.length;
        }
        ctx.stroke();
    }

    fill(playArea, color = "black") {
        var ctx = playArea.ctx;
        ctx.fillStyle = color;
        ctx.beginPath();
        var zeroVectorHits = 0;
        var vectorIndex = 0;
        while (zeroVectorHits < 2) {
            const vector = this.vectors[vectorIndex];
            if (vectorIndex == 0) {
                if (zeroVectorHits == 0) {
                    ctx.moveTo(vector.xoffset, vector.yoffset);
                } else {
                    ctx.lineTo(vector.xoffset, vector.yoffset);
                }
                zeroVectorHits++;
            } else {
                ctx.lineTo(vector.xoffset, vector.yoffset);
            }
            vectorIndex = (vectorIndex + 1) % this.vectors.length;
        }
        ctx.fill();
    }
}