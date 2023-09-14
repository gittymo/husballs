var sineTable = [];
var cosineTable = [];

const DEG2RADRATIO = 180.0 / Math.PI;

function degreesToRadians(degrees) {
    if (isNaN(degrees)) degrees = 0;
    degrees -= 90.0;
    if (degrees < 0) {
        degrees = 360 + (degrees % 360);
    } else if (degrees > 360) {
        degrees = degrees % 360;
    }
    return degrees / DEG2RADRATIO;
}

function initLookupTables() {
    for (var degrees = 0; degrees < 360; degrees++) {
        sineTable[degrees] = Math.sin(degrees / DEG2RADRATIO);
        cosineTable[degrees] = Math.cos(degrees / DEG2RADRATIO);        
    }
}