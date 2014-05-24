function GeneticTuner(){
    this.bestA = null;
    this.bestAScore = null;
    this.bestB = null;
    this.bestBScore = null;

    this.candidateIndex = -1;
    this.candidates = new Array();
};

GeneticTuner.prototype.randomCandidates = function(count){
    for(var i = 0; i < count; i++){
        var candidate = new Array(4);
        for(var j = 0; j < 4; j++){
            candidate[j] = Math.random();
        }
        this.candidates.push(candidate);
    }
}

GeneticTuner.prototype.crossover = function(){
    for(var a = 0; a < 2; a++){
        for(var b = 0; b < 2; b++){
            for(var c = 0; c < 2; c++){
                for(var d = 0; d < 2; d++){
                    var candidate = new Array(4);
                    candidate[0] = a == 0 ? this.bestA[0] : this.bestB[0];
                    candidate[1] = b == 0 ? this.bestA[1] : this.bestB[1];
                    candidate[2] = c == 0 ? this.bestA[2] : this.bestB[2];
                    candidate[3] = d == 0 ? this.bestA[3] : this.bestB[3];
                    this.candidates.push(candidate);
                }
            }
        }
    }
};

GeneticTuner.prototype.mutate = function(){
    for(var i = 0; i < this.candidates.length; i++){
        for(var j = 0; j < this.candidates[i].length; j++){
            this.candidates[i][j] += (Math.random() - 0.5) / 100;
        }
    }
};

GeneticTuner.prototype.selection = function(candidate, score){
    if (score > this.bestAScore || this.bestAScore == null){
        this.bestBScore = this.bestAScore;
        this.bestB = this.bestA;

        this.bestAScore = score;
        this.bestA = candidate;
    }
};

GeneticTuner.prototype.nextCandidate = function(){
    this.candidateIndex++;
    if (this.candidateIndex >= this.candidates.length){
        this.candidates = new Array();
        this.crossover();
        this.mutate();
        this.candidateIndex = 0;
    }

    return this.candidates[this.candidateIndex];
};