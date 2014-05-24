// Constructor
function Grid(rows, columns){
    this.rows = rows;
    this.columns = columns;

    this.cells = new Array(rows);
    for (var r = 0; r < this.rows; r++) {
        this.cells[r] = new Array(this.columns);
        for(var c = 0; c < this.columns; c++){
            this.cells[r][c] = 0;
        }
    }
};

// Methods
Grid.prototype.clone = function(){
    var _grid = new Grid(this.rows, this.columns);
    for (var r = 0; r < this.rows; r++) {
        for(var c = 0; c < this.columns; c++){
            _grid.cells[r][c] = this.cells[r][c];
        }
    }
    return _grid;
};

Grid.prototype.clearLines = function(){
    var distance = 0;
    var row = new Array(this.columns);
    for(var r = this.rows - 1; r >= 0; r--){
        if (this.isLine(r)){
            distance++;
            for(var c = 0; c < this.columns; c++){
                this.cells[r][c] = 0;
            }
        }else if (distance > 0){
            for(var c = 0; c < this.columns; c++){
                this.cells[r + distance][c] = this.cells[r][c];
                this.cells[r][c] = 0;
            }
        }
    }
    return distance;
};

// Computations
Grid.prototype.isLine = function(row){
    for(var c = 0; c < this.columns; c++){
        if (this.cells[row][c] == 0){
            return false;
        }
    }
    return true;
};

Grid.prototype.isEmptyRow = function(row){
    for(var c = 0; c < this.columns; c++){
        if (this.cells[row][c] == 1){
            return false;
        }
    }
    return true;
};

Grid.prototype.exceeded = function(){
    return !this.isEmptyRow(0) || !this.isEmptyRow(1);
};

Grid.prototype.height = function(){
    var r = 0;
    for(; r < this.rows && this.isEmptyRow(r); r++);
    return this.rows - r;
};

Grid.prototype.lines = function(){
    var count = 0;
    for(var r = 0; r < this.rows; r++){
        if (this.isLine(r)){
            count++;
        }
    }
    return count;
};

Grid.prototype.holes = function(){
    var count = 0;
    for(var c = 0; c < this.columns; c++){
        var block = false;
        for(var r = 0; r < this.rows; r++){
            if (this.cells[r][c] == 1) {
                block = true;
            }else if (this.cells[r][c] == 0 && block){
                count++;
            }
        }
    }
    return count;
};

Grid.prototype.blockades = function(){
    var count = 0;
    for(var c = 0; c < this.columns; c++){
        var hole = false;
        for(var r = this.rows - 1; r >= 0; r--){
            if (this.cells[r][c] == 0){
                hole = true;
            }else if (this.cells[r][c] == 1 && hole){
                count++;
            }
        }
    }
    return count;
}

Grid.prototype.aggregateHeight = function(){
    var total = 0;
    for(var c = 0; c < this.columns; c++){
        total += this.columnHeight(c);
    }
    return total;
};

Grid.prototype.bumpiness = function(){
    var total = 0;
    for(var c = 0; c < this.columns - 1; c++){
        total += Math.abs(this.columnHeight(c) - this.columnHeight(c+ 1));
    }
    return total;
}

Grid.prototype.columnHeight = function(column){
    var r = 0;
    for(; r < this.rows && this.cells[r][column] == 0; r++);
    return this.rows - r;
};

// Piece
Grid.prototype.addPiece = function(piece) {
    for(var r = 0; r < piece.cells.length; r++) {
        for (var c = 0; c < piece.cells[r].length; c++) {
            var _r = piece.row + r;
            var _c = piece.column + c;
            if (piece.cells[r][c] == 1 && _r >= 0){
                this.cells[_r][_c] = 1;
            }
        }
    }
};

Grid.prototype.valid = function(piece){
    for(var r = 0; r < piece.cells.length; r++){
        for(var c = 0; c < piece.cells[r].length; c++){
            var _r = piece.row + r;
            var _c = piece.column + c;
            if (piece.cells[r][c] == 1){
                if (!(_c < this.columns && _r < this.rows && this.cells[_r][_c] == 0)){
                    return false;
                }
            }
        }
    }
    return true;
};

Grid.prototype.canMoveDown = function(piece){
    for(var r = 0; r < piece.cells.length; r++){
        for(var c = 0; c < piece.cells[r].length; c++){
            var _r = piece.row + r + 1;
            var _c = piece.column + c;
            if (piece.cells[r][c] == 1 && _r >= 0){
                if (!(_r < this.rows && this.cells[_r][_c] == 0)){
                    return false;
                }
            }
        }
    }
    return true;
};

Grid.prototype.canMoveLeft = function(piece){
    for(var r = 0; r < piece.cells.length; r++){
        for(var c = 0; c < piece.cells[r].length; c++){
            var _r = piece.row + r;
            var _c = piece.column + c - 1;
            if (piece.cells[r][c] == 1){
                if (!(_c >= 0 && this.cells[_r][_c] == 0)){
                    return false;
                }
            }
        }
    }
    return true;
};

Grid.prototype.canMoveRight = function(piece){
    for(var r = 0; r < piece.cells.length; r++){
        for(var c = 0; c < piece.cells[r].length; c++){
            var _r = piece.row + r;
            var _c = piece.column + c + 1;
            if (piece.cells[r][c] == 1){
                if (!(_c >= 0 && this.cells[_r][_c] == 0)){
                    return false;
                }
            }
        }
    }
    return true;
};

Grid.prototype.rotateOffset = function(piece){
    var _piece = piece.clone();
    _piece.rotate(1);
    if (this.valid(_piece)) {
        return {rowOffset: _piece.row - piece.row, columnOffset:_piece.column - piece.column};
    }

    // Kicking
    var initialRow = _piece.row;
    var initialCol = _piece.column;

    for (var i = 0; i < _piece.dimension - 1; i++) {
        _piece.column = initialCol + i;
        if (this.valid(_piece)) {
            return {rowOffset: _piece.row - piece.row, columnOffset:_piece.column - piece.column};
        }

        for (var j = 0; j < _piece.dimension - 1; j++) {
            _piece.row = initialRow - j;
            if (this.valid(_piece)) {
                return {rowOffset: _piece.row - piece.row, columnOffset:_piece.column - piece.column};
            }
        }
        _piece.row = initialRow;
    }
    _piece.column = initialCol;

    for (var i = 0; i < _piece.dimension - 1; i++) {
        _piece.column = initialCol - i;
        if (this.valid(_piece)) {
            return {rowOffset: _piece.row - piece.row, columnOffset:_piece.column - piece.column};
        }

        for (var j = 0; j < _piece.dimension - 1; j++) {
            _piece.row = initialRow - j;
            if (this.valid(_piece)) {
                return {rowOffset: _piece.row - piece.row, columnOffset:_piece.column - piece.column};
            }
        }
        _piece.row = initialRow;
    }
    _piece.column = initialCol;

    return null;
};
