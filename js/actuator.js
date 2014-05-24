function Actuator()
{
    this.gridCanvas = document.getElementById("grid-canvas");
};

Actuator.prototype.actuate = function (grid){
    context = this.gridCanvas.getContext('2d');

    context.save();
    context.clearRect(0, 0, this.gridCanvas.width, this.gridCanvas.height);

    for(var r = 2; r < grid.rows; r++){
        for(var c = 0; c < grid.columns; c++){
            if (grid.cells[r][c] == 1){
                context.fillStyle="#FF0000";
                context.fillRect(20 * c, 20 * (r - 2), 20, 20);
                context.strokeStyle="#FFFFFF";
                context.strokeRect(20 * c, 20 * (r - 2), 20, 20);
            }
        }
    }

    context.restore();
};