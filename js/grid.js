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

Grid.prototype.clone = function(){
    var _grid = new Grid(this.rows, this.columns);
    for (var r = 0; r < this.rows; r++) {
        for(var c = 0; c < this.columns; c++){
            _grid.cells[r][c] = this.cells[r][c];
        }
    }
    return _grid;
};

Grid.prototype.canFall = function(piece){
    for(var r = piece.cells.length - 1; r >= 0; r--){
        for(var c = 0; c < piece.cells.length; c++){
            if (piece.cells[r][c] == 1) {
                if (piece.row + r + 1 >= this.rows || this.cells[piece.row + r + 1][piece.column + c] == 1){
                    return false;
                }
            }
        }
    }
    return true;
}

/*
Grid.prototype.applyGravity = function(maxDistance){
    if (maxDistance == null){
        maxDistance = this.rows - 1;
    }

    var distance = maxDistance;
    var fixed = false;
    for(var r = this.rows - 1; r >= 0; r--){
        for(var c = 0; c < this.columns; c++){
            if (this.isFree(r, c)) {
                var d = 0;
                for (; d < maxDistance && r + d + 1 < this.rows && !this.isFixed(r + d + 1, c); d++);
                if (r + d + 1 >= this.rows || this.isFixed(r + d + 1, c)){
                    fixed = true;
                }
                if (d < distance) {
                    distance = d;
                }
            }
        }
    }

    if (distance == 0){
        return 0;
    }

    for(var r = this.rows - 1; r >= 0; r--){
        for(var c = 0; c < this.columns; c++) {
            if (this.isFree(r, c)) {
                this.setEmpty(r, c);
                if (fixed){
                    this.setFixed(r + distance, c);
                }else{
                    this.setFree(r + distance, c);
                }
            }
        }
    }

    return distance;
};
*/

Grid.prototype.valid = function(piece){
    for(var r = 0; r < piece.cells.length; r++){
        for(var c = 0; c < piece.cells[r].length; c++){
            var _r = piece.row + r;
            var _c = piece.column + c;
            if (piece.cells[r][c] == 1){
                if (!(_c >= 0 && _c < this.columns && _r < this.rows && _r >= 0 && this.cells[_r][_c] == 0)){
                    return false;
                }
            }
        }
    }
    return true;
};

Grid.prototype.addPiece = function(piece){
    for(var r = 0; r < piece.dimension; r++){
        for(var c = 0; c < piece.dimension; c++){
            if (piece.cells[r][c] == 1){
                this.cells[piece.row + r][piece.column + c] = 1;
            }
        }
    }
};