albertcheu.github.io
====================
Cheu's Fun Game

Context Free Grammar

Three color classes: R, G, B

Six shape sets: Square, Triangle, Star, X, Dot, Smile

A symbol is colored shape (i.e. a green triangle)

The left side of the screen lists Good and Bad Sequences. Good sequences follow the Rule; the objective of the game is to determine the Rule.

The right side of the screen is where players input Rule Rows. A Rule Row is denoted by a number (starting @ 0) and a sequence of Tiles.

A Tile can be a color class, a shape set, or a single symbol. For instance "0: R B Square" says that a Good sequence consists of a red symbol, a blue symbol, and a square.

In addition, there is the OR tile. For instance, "0: G OR X" means that a Good sequence is made up of one green symbol or one X

Finally, a Rule Row can be referenced in other Rows (or itself!). For instance, "0: G 1 OR X 2" means that a Good sequence is made up of a green symbol followed by whatever Row 1 says OR an X followed by whatever Row 2 says.

Each valid solution gets 50 points, minus one point per tile. For instance, if a solution has 8 tiles in total, the final score is 42.