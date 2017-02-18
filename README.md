#Tetris AI

##About
This project contains a graphical interface for Tetris and a pre-tuned AI that plays the game by itself. Within the graphical interface, you can toggle the AI on or off to allow the game to be played by the AI or by yourself respectively.

##Game Rules
Below are the Tetris rules in place:
- The Tetris grid is 10 cells wide and 22 cells tall, with the top 2 rows hidden.
- All Tetrominoes will start in the middle of the top 2 rows.
- There are 7 Tetrominoes: "I", "O", "J", "L", "S", "Z", "T".
- The ["Super Rotation System"](http://tetris.wikia.com/wiki/SRS) is used for all rotations.
- The ["7 System"](http://tetris.wikia.com/wiki/Random_Generator) random generator is used to randomize the next pieces.
- One lookahead piece is allowed.

It should be noted that the rules may vary across game implementations. As such, when comparing game experience and AI performance across different game implementations, the differences in rules should be considered.

##AI
The AI used is one that exhausts all possible placements of the current piece, including the lookahead piece, to determine the placement of the current piece that eventually leads to a game state that is most ideal.

In other words, the heuristic used considers a tree with the current game state as the root. At depth 1, we have nodes that represent all possible game states resulted by the possible placements of the current piece in the root game state. At depth 2, we have nodes that represent all possible game states resulted by the possible placements of the lookahaead pieces in the game states of their respective parents. We then compute a score for each node at depth 2. The score assigned to each node at depth 1 is then the highest score of the child nodes at depth 2. The AI picks the placement that leads to the depth 1 node with the highest score.

The score of a game state given by a linear combination the following properties of the Tetris grid and their respective weights:
- Aggregate Height: The sum of height of each column.
- Number of Complete Lines: Self explanatory.
- Number of Holes: The number of empty spaces such that there is at least one tile in the same column above it.
- Bumpiness: The sum of the absolute differences between the heights of adjacent columns.

The default AI is tuned to have the following weights:
- Aggregate Height: 0.510066
- Number of Complete Lines: 0.760666
- Number of Holes: 0.35663
- Bumpiness: 0.184483

##Tuning
We use genetic tuning to tune the weights of the AI. Following are the details of the main genetic tuning details:
- Gene: Each gene is a 4-dimensional unit vector with components as weights for Aggregate Height, Number of Complete Lines, Number of Holes and Bumpiness in order.
- Initial Population: 100.
- Fitness Function: The fitness of each gene is determined by the total number of lines cleared from running the respective AI for 5 games, each for a maximum of 200 moves. The maximum theoretical fitness is 5 * 200 * 4 / 10 = 400. Hence the tuning can be aborted when the highest fitness among the population is close enough to this limit.
- Selection: We use tournament selection twice to select two genes for crossover. The tournament considers 10% of the population each time.
- Cross Over: A linear combination of the two candidate genes are taken, each with a weight proportionate to their fitness. The linear combination is then normalized to give a unit vector.
- Mutation: Each new gene is given a 5% chance of mutation. When being mutated, a random component of the gene is incremented randomly from -0.2 to +0.2.
- Replacement: After producing genes that can replace 30% of the population (i.e. 30 new genes), we use Delete-N-Last Replacement to replace the 30 least fit genes in the current population with the 30 new genes produced.

In order to run the tuning, one can open up the Developer Console in the web browser and run the command `new Tuner().tune();`
