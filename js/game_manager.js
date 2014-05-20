function GameManager(){
    this.grid = new Grid(20, 10);
    this.actuator = new Actuator();
    this.workingPiece = null;

    var self = this;
    document.addEventListener("keydown", function (event){
        switch(event.which){
            case 40: //down
                self.moveDown();
                break;
            case 37: //left
                self.moveLeft();
                break;
            case 39: //right
                self.moveRight();
                break;
            case 38: //up
                self.rotate();
                break;
        }
    });
    this.randomWorkingPiece();
    this.gravityLoop();
};

GameManager.prototype.randomWorkingPiece = function(){
    this.workingPiece = new Piece(PieceCells[Math.floor((Math.random() * 7))]);
    this.workingPiece.row = 0;
    this.workingPiece.column = Math.floor((this.grid.columns - this.workingPiece.dimension) / 2);
}

GameManager.prototype.gravityLoop = function(){
    var self = this;
    setTimeout(function(){
        self.moveDown();
        self.gravityLoop();
    }, 800);
};

GameManager.prototype.actuate = function(){
    var _grid = this.grid.clone();
    if (this.workingPiece != null) {
        _grid.addPiece(this.workingPiece);
    }
    this.actuator.actuate(_grid);
};

GameManager.prototype.moveDown = function(){
    this.workingPiece.row++;
    if (this.grid.valid(this.workingPiece)){
        this.actuate();
    }else {
        this.workingPiece.row--;
        this.grid.addPiece(this.workingPiece);
        this.randomWorkingPiece();
        this.actuate();
    }
};

GameManager.prototype.moveLeft = function(){
    this.workingPiece.column--;
    if (this.grid.valid(this.workingPiece)){
        this.actuate();
    }else{
        this.workingPiece.column++;
    }
};

GameManager.prototype.moveRight = function(){
    this.workingPiece.column++;
    if (this.grid.valid(this.workingPiece)){
        this.actuate();
    }else{
        this.workingPiece.column--;
    }
};

GameManager.prototype.rotate = function(){
    this.workingPiece.rotate(1);
    if (this.grid.valid(this.workingPiece)){
        this.actuate();
        return;
    }

    var initialRow = this.workingPiece.row;
    var initialCol = this.workingPiece.column;

    for(var i =0; i < this.workingPiece.dimension - 1; i++){
        this.workingPiece.column = initialCol + i;
        if (this.grid.valid(this.workingPiece)) {
            this.actuate();
            return;
        }

        for(var j = 0; j < this.workingPiece.dimension - 1; j++){
            this.workingPiece.row = initialRow - j;
            if (this.grid.valid(this.workingPiece)) {
                this.actuate();
                return;
            }
        }
        this.workingPiece.row = initialRow;
    }
    this.workingPiece.column = initialCol;

    for(var i =0; i < this.workingPiece.dimension - 1; i++){
        this.workingPiece.column = initialCol - i;
        if (this.grid.valid(this.workingPiece)) {
            this.actuate();
            return;
        }

        for(var j = 0; j < this.workingPiece.dimension - 1; j++){
            this.workingPiece.row = initialRow - j;
            if (this.grid.valid(this.workingPiece)) {
                this.actuate();
                return;
            }
        }
        this.workingPiece.row = initialRow;
    }
    this.workingPiece.column = initialCol;


    this.workingPiece.rotate(3);
};