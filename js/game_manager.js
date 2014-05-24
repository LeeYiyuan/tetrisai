function GameManager(){
    this.grid = new Grid(22, 10);
    this.actuator = new Actuator();
    this.rpg = new RandomPieceGenerator();
    this.ai = new AI(0.0465458398684859,0.2214985086163506,0.9363426595530472,0.07156617472646758);
    this.workingPieces = [this.rpg.nextPiece(), this.rpg.nextPiece()];
    this.workingPiece = this.workingPieces[0];

    this.isOver = true;
    this.score = 0;

    var self = this;
    document.addEventListener("keydown", function (event){
        switch(event.which){
            case 32: //drop
                self.drop();
                self.actuate(self.grid, self.workingPiece);
                break;
            case 40: //down
                self.applyGravity();
                self.actuate(self.grid, self.workingPiece);
                break;
            case 37: //left
                self.moveLeft();
                self.actuate(self.grid, self.workingPiece);
                break;
            case 39: //right
                self.moveRight();
                self.actuate(self.grid, self.workingPiece);
                break;
            case 38: //up
                self.rotate();
                self.actuate(self.grid, self.workingPiece);
                break;
        }
    });
    document.getElementById('reset-button').onclick = function(){
        self.setup();
    }

    self.actuate(this.grid, this.workingPiece);
    this.loop();
    //window.requestAnimationFrame(function(timestamp){
    //    self.doUpdate(timestamp);
    //});
};

GameManager.prototype.doUpdate = function(timestamp){
    this.applyGravity();
    this.actuate(this.grid, this.workingPiece);
    var self = this;
    window.requestAnimationFrame(function(timestamp){
        self.doUpdate(timestamp);
    });
};

GameManager.prototype.loop = function(){
    var self = this;
    setTimeout(function(){
        self.applyGravity();
        self.actuate(self.grid, self.workingPiece);
        self.loop();
    }, 0);
}

GameManager.prototype.setup = function(){
    this.grid = new Grid(22, 10);
    this.score = 0;
    this.isOver = false;
    this.workingPiece = this.rpg.nextPiece();
    this.actuate(this.grid, this.workingPiece);
};

GameManager.prototype.actuate = function(grid, workingPiece){
    var _grid = grid.clone();
    if (workingPiece != null) {
        _grid.addPiece(workingPiece);
    }
    this.actuator.actuate(_grid);
    document.getElementById("score-container").innerHTML = this.score.toString();
};

GameManager.prototype.setWorkingPiece = function(){
    this.grid.addPiece(this.workingPiece);
    this.score += this.grid.clearLines();
    if (!this.grid.exceeded()){
        for(var i = 0; i < this.workingPieces.length - 1; i++){
            this.workingPieces[i] = this.workingPieces[i + 1];
        }
        this.workingPieces[this.workingPieces.length - 1] = this.rpg.nextPiece();
        this.workingPiece = this.workingPieces[0];
        this.aiMove();
    }else{
        alert("Game over");
    }
};

GameManager.prototype.applyGravity = function(){
    if (this.grid.canMoveDown(this.workingPiece)) {
        this.workingPiece.row++;
    }else{
        this.setWorkingPiece();
    }
};

GameManager.prototype.drop = function(){
    while(this.grid.canMoveDown(this.workingPiece)){
        this.workingPiece.row++;
    }
    this.setWorkingPiece();
};

GameManager.prototype.moveLeft = function(){
    if (this.grid.canMoveLeft(this.workingPiece)){
        this.workingPiece.column--;
    }
};

GameManager.prototype.moveRight = function(){
    if (this.grid.canMoveRight(this.workingPiece)){
        this.workingPiece.column++;
    }
};

GameManager.prototype.rotate = function(){
    var offset = this.grid.rotateOffset(this.workingPiece);
    if (offset != null){
        this.workingPiece.rotate(1);
        this.workingPiece.row += offset.rowOffset;
        this.workingPiece.column += offset.columnOffset;
    }
};

GameManager.prototype.aiMove = function(){
    this.workingPiece = this.ai.best(this.grid, this.workingPieces, 0).piece;
};


