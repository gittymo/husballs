class Vector {
    constructor(xoffset, yoffset) {
        this.xoffset = xoffset;
        this.yoffset = yoffset;
    }

    rotate(degrees) {
        degrees -= 90;
        if (degrees < 0) {
            degrees = 360 + (degrees % 360);
        } else if (degrees >= 360) {
            degrees = degrees % 360;
        }

        const new_xoffset = Math.floor((this.xoffset * cosineTable[degrees]) - (this.yoffset * sineTable[degrees]));
        const new_yoffset = Math.floor((this.xoffset * sineTable[degrees]) + (this.yoffset * cosineTable[degrees]));
        return new Vector(new_xoffset, new_yoffset);
    }

    translate(originX, originY) {
        return new Vector(originX + this.xoffset, originY + this.yoffset);
    }

    rotateAndTranslate(degrees, xoffset, yoffset) {
        degrees -= 90;
        if (degrees < 0) {
            degrees = 360 + (degrees % 360);
        } else if (degrees >= 360) {
            degrees = degrees % 360;
        }

        const new_xoffset = Math.floor((this.xoffset * cosineTable[degrees]) - (this.yoffset * sineTable[degrees]));
        const new_yoffset = Math.floor((this.xoffset * sineTable[degrees]) + (this.yoffset * cosineTable[degrees]));
        return new Vector(new_xoffset + xoffset, new_yoffset + yoffset);
    }
}