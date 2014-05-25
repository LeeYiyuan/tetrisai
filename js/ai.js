function AI(heightWeight, linesWeight, holesWeight, bumpinessWeight){
    this.heightWeight = heightWeight;
    this.linesWeight = linesWeight;
    this.holesWeight = holesWeight;
    this.bumpinessWeight = bumpinessWeight;
};

AI.prototype.best = function(grid, workingPieces, workingPieceIndex){
    var best = null;
    var bestScore = null;
    var workingPiece = workingPieces[workingPieceIndex];

    for(var rotation = 0; rotation < 4; rotation++){
        var _piece = workingPiece.clone();
        _piece.rotate(rotation);

        while(grid.canMoveLeft(_piece)){
            _piece.column --;
        }

        while(grid.valid(_piece)){
            var _pieceSet = _piece.clone();
            while(grid.canMoveDown(_pieceSet)){
                _pieceSet.row++;
            }

            var _grid = grid.clone();
            _grid.addPiece(_pieceSet);

            var score = null;
            if (workingPieceIndex == (workingPieces.length - 1)) {
                score = -this.heightWeight * _grid.aggregateHeight() + this.linesWeight * _grid.lines() - this.holesWeight * _grid.holes() - this.bumpinessWeight * _grid.bumpiness();
            }else{
                score = this.best(_grid, workingPieces, workingPieceIndex + 1).score;
            }

            if (score > bestScore || bestScore == null){
                bestScore = score;
                best = _piece.clone();
            }

            _piece.column++;
        }
    }

    return {piece:best, score:bestScore};
};