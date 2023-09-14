class PlayArea {
    constructor(canvasElementId, gameStartAreaHeightAsRatio = 0.125) {
        // if (!canvasElementId instanceof String || typeof canvasElementId !== "string") throw "Invalid canvas element id";
        // if (!document.getElementById(canvasElementId) instanceof HTMLCanvasElement) throw "Invalid canvas reference";
        // if (isNaN(gameStartAreaHeightAsRatio) || gameStartAreaHeightAsRatio < 0 || gameStartAreaHeightAsRatio > 1) throw "Invalid start area";
        this.canvas = document.getElementById(canvasElementId);
        this.canvas.playArea = this;
        this.ctx = this.canvas.getContext("2d");
        this.gameStartAreaHeight = this.canvas.height * gameStartAreaHeightAsRatio;
        this.gameStarted = false;
        this.oldMouseY = 0;

        this.playerShield = new PlayerShield(this);

        this.spaceRocks = [];
        for (var i = 0; i < 10; i++) {
            this.spaceRocks[i] = new SpaceRock(this);
        }

        this.spaceFleet = [];
        const leftMostShipEdge = this.playerShield.x - (this.playerShield.arcRadius - 80);
        const rightMostShipEdge = this.canvas.width - 40;
        var y = this.canvas.height / 2 - (baseFleetCraftSize * 5);
        var craft = 0;
        for (var j = 0; j < 3; j++) {
            var x = leftMostShipEdge + ((baseFleetCraftSize * 4.5) * (1 - (j % 2)));
            while (x < rightMostShipEdge) {
                this.spaceFleet[craft++] = new FleetCraft(this, x, y);
                x += baseFleetCraftSize * 9;
            }
            y += baseFleetCraftSize * 5;
        }

        this.canvas.onmousemove = function(e) {
            var mouseY = e.pageY - this.getBoundingClientRect().y;
            if (!this.playArea.gameStarted) {
                this.playArea.checkGameStartTrigger(e);
            } else {
                const halfCanvasHeight = this.height / 2.0;
                var centreRatio = (mouseY - halfCanvasHeight) / halfCanvasHeight;
                this.playArea.playerShield.setTargetAngle(centreRatio);
            }
            this.playArea.oldMouseY = mouseY;
        }
    }

    checkGameStartTrigger(event) {
        if (event instanceof MouseEvent) {
            const gameStartAreaTop = (this.canvas.height - this.gameStartAreaHeight) / 2.0;
            const gameStartAreaBottom = gameStartAreaTop + this.gameStartAreaHeight;
            if (event.pageY > gameStartAreaTop && event.pageY < gameStartAreaBottom) this.gameStarted = true;
        }
    }

    get width() {
        return this.canvas.width;
    }

    get height() {
        return this.canvas.height;
    }

    paint() {
        if (this.gameStarted) {
            this.ctx.clearRect(0, 0, this.width, this.height);
            this.playerShield.paint();
            for (var i = 0; i < this.spaceRocks.length; i++) {
                this.spaceRocks[i].paint();
            }
            for (var i = 0; i < this.spaceFleet.length; i++) {
                this.spaceFleet[i].paint();
            }
        }
    }

    update() {
        if (this.gameStarted) {
            this.playerShield.move();
            for (var i = 0; i < this.spaceRocks.length; i++) {
                this.spaceRocks[i].move();
            }
            for (var i = 0; i < this.spaceFleet.length; i++) {
                this.spaceFleet[i].move();
            }
            this.paint();
            this.playerShield.checkForCollisions();
        }
    }
}