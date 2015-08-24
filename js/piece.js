function Piece(cells){
    this.cells = cells;

    this.dimension = this.cells.length;
    this.row = 0;
    this.column = 0;
};

Piece.fromIndex = function(index){
    var piece;
    switch (index){
        case 0:// O
            piece = new Piece([
                [1, 1],
                [1, 1]
            ]);
            break;
        case 1: // J
            piece = new Piece([
                [1, 0, 0],
                [1, 1, 1],
                [0, 0, 0]
            ]);
            break;
        case 2: // L
            piece = new Piece([
                [0, 0, 1],
                [1, 1, 1],
                [0, 0, 0]
            ]);
            break;
        case 3: // Z
            piece = new Piece([
                [1, 1, 0],
                [0, 1, 1],
                [0, 0, 0]
            ]);
            break;
        case 4: // S
            piece = new Piece([
                [0, 1, 1],
                [1, 1, 0],
                [0, 0, 0]
            ]);
            break;
        case 5: // T
            piece = new Piece([
                [0, 1, 0],
                [1, 1, 1],
                [0, 0, 0]
            ]);
            break;
        case 6: // I
            piece = new Piece([
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ]);
            break;

    }
    piece.row = 0;
    piece.column = Math.floor((10 - piece.dimension) / 2); // Centralize
    return piece;
};

Piece.prototype.clone = function(){
    var _cells = new Array(this.dimension);
    for (var r = 0; r < this.dimension; r++) {
        _cells[r] = new Array(this.dimension);
        for(var c = 0; c < this.dimension; c++){
            _cells[r][c] = this.cells[r][c];
        }
    }

    var piece = new Piece(_cells);
    piece.row = this.row;
    piece.column = this.column;
    return piece;
};

Piece.prototype.rotate = function(rotations){
    for(var i = 0; i < rotations; i++) {
        var _cells = new Array(this.dimension);
        for (var r = 0; r < this.dimension; r++) {
            _cells[r] = new Array(this.dimension);
        }

        switch (this.dimension) { // Assumed square matrix
            case 2:
                _cells[0][0] = this.cells[1][0];
                _cells[0][1] = this.cells[0][0];
                _cells[1][0] = this.cells[1][1];
                _cells[1][1] = this.cells[0][1];
                break;
            case 3:
                _cells[0][0] = this.cells[2][0];
                _cells[0][1] = this.cells[1][0];
                _cells[0][2] = this.cells[0][0];
                _cells[1][0] = this.cells[2][1];
                _cells[1][1] = this.cells[1][1];
                _cells[1][2] = this.cells[0][1];
                _cells[2][0] = this.cells[2][2];
                _cells[2][1] = this.cells[1][2];
                _cells[2][2] = this.cells[0][2];
                break;
            case 4:
                _cells[0][0] = this.cells[3][0];
                _cells[0][1] = this.cells[2][0];
                _cells[0][2] = this.cells[1][0];
                _cells[0][3] = this.cells[0][0];
                _cells[1][3] = this.cells[0][1];
                _cells[2][3] = this.cells[0][2];
                _cells[3][3] = this.cells[0][3];
                _cells[3][2] = this.cells[1][3];
                _cells[3][1] = this.cells[2][3];
                _cells[3][0] = this.cells[3][3];
                _cells[2][0] = this.cells[3][2];
                _cells[1][0] = this.cells[3][1];

                _cells[1][1] = this.cells[2][1];
                _cells[1][2] = this.cells[1][1];
                _cells[2][2] = this.cells[1][2];
                _cells[2][1] = this.cells[2][2];
                break;
        }

        this.cells = _cells;
    }
};
