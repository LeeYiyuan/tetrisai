function GameManager(){
    var gridCanvas = document.getElementById('grid-canvas');
    var nextCanvas = document.getElementById('next-canvas');
    var scoreContainer = document.getElementById("score-container");
    var resetButton = document.getElementById('reset-button');
    var aiButton = document.getElementById('ai-button');
    document.addEventListener('keydown', onKeyDown);

    var grid = new Grid(22, 10);
    var rpg = new RandomPieceGenerator();
    var ai = new AI(0.510066, 0.760666, 0.35663, 0.184483);
    var workingPieces = [rpg.nextPiece(), rpg.nextPiece()];
    var workingPiece = workingPieces[0];
    var isAiActive = true;
    var gravityTimer = new Timer(onGravityTimerTick, 1000 / 60);
    var score = 0;

    function updateGridCanvas(){
        var _grid = grid.clone();
        if (workingPiece != null) {
            _grid.addPiece(workingPiece);
        }

        var context = gridCanvas.getContext('2d');
        context.save();
        context.clearRect(0, 0, gridCanvas.width, gridCanvas.height);
        for(var r = 2; r < _grid.rows; r++){
            for(var c = 0; c < _grid.columns; c++){
                if (_grid.cells[r][c] == 1){
                    context.fillStyle="#FF0000";
                    context.fillRect(20 * c, 20 * (r - 2), 20, 20);
                    context.strokeStyle="#FFFFFF";
                    context.strokeRect(20 * c, 20 * (r - 2), 20, 20);
                }
            }
        }
        context.restore();
    }

    function updateNextCanvas(){
        var context = nextCanvas.getContext('2d');
        context.save();
        context.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
        var next = workingPieces[1];
        var xOffset = next.dimension == 2 ? 20 : next.dimension == 3 ? 10 : next.dimension == 4 ? 0 : null;
        var yOffset = next.dimension == 2 ? 20 : next.dimension == 3 ? 20 : next.dimension == 4 ? 10 : null;
        for(var r = 0; r < next.dimension; r++){
            for(var c = 0; c < next.dimension; c++){
                if (next.cells[r][c] == 1){
                    context.fillStyle="#FF0000";
                    context.fillRect(xOffset + 20 * c, yOffset + 20 * r, 20, 20);
                    context.strokeStyle="#FFFFFF";
                    context.strokeRect(xOffset + 20 * c, yOffset + 20 * r, 20, 20);
                }
            }
        }
        context.restore();
    }

    function updateScoreContainer(){
        scoreContainer.innerHTML = score.toString();
    }

    function onGravityTimerTick(){
        if (workingPiece.moveDown(grid)) {
            updateGridCanvas();
            return;
        }

        grid.addPiece(workingPiece);
        updateGridCanvas();

        score += grid.clearLines();
        updateScoreContainer();

        if (!grid.exceeded()){
            for(var i = 0; i < workingPieces.length - 1; i++){
                workingPieces[i] = workingPieces[i + 1];
            }
            workingPieces[workingPieces.length - 1] = rpg.nextPiece();
            workingPiece = workingPieces[0];
            if(isAiActive){
                workingPiece = ai.best(grid, workingPieces);
                gravityTimer.reset(1000 / 60);
            }else{
                workingPiece = workingPieces[0];
                gravityTimer.resetForward(500);
            }
            updateNextCanvas();
        }else{
            gravityTimer.stop();
            alert("Game Over!");
        }
    }

    function onKeyDown(event){
        if(isAiActive){
            return;
        }
        switch(event.which){
            case 32: // spacebar
                gravityTimer.resetForward(1000 / 60);
                break;
            case 40: // down
                gravityTimer.resetForward(500);
                break;
            case 37: //left
                if (workingPiece.moveLeft(grid)){
                    updateGridCanvas();
                }
                break;
            case 39: //right
                if (workingPiece.moveRight(grid)){
                    updateGridCanvas();
                }
                break;
            case 38: //up
                workingPiece.rotate(grid);
                updateGridCanvas();
                break;
        }
    }

    aiButton.onclick = function(){
        if (isAiActive){
            isAiActive = false;
            aiButton.style.backgroundColor = "#f9f9f9";
            gravityTimer.resetForward(500);
        }else{
            isAiActive = true;
            aiButton.style.backgroundColor = "#e9e9ff";
            gravityTimer.resetForward(1000 / 60);
        }
    }

    resetButton.onclick = function(){
        gravityTimer.stop();
        grid = new Grid(22, 10);
        rpg = new RandomPieceGenerator();
        workingPieces = [rpg.nextPiece(), rpg.nextPiece()];
        workingPiece = workingPieces[0];
        score = 0;
        gravityTimer.resetForward(isAiActive ? 1000 / 60 : 500);
    }

    aiButton.style.backgroundColor = "#e9e9ff";
    gravityTimer.start();
};
