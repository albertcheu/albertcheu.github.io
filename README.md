albertcheu.github.io
====================
Cheu's Fun Game

Context Free Grammar

The top of the screen lists sequences of symbols that obey a common pattern; the objective of the game is to formally express the pattern

A symbol is colored shape (i.e. a green triangle)

There are three color classes (Red, Green, Blue) and six shape sets (Box, Triangle, Circle, X, Star, Face)

The bottom of the screen is where players input Rule Rows. A Rule Row is denoted by a number (starting @ 0) and a sequence of Tiles.

A tile can be a color class, a shape set, or a symbol. For instance "0: R B box" says that each sequence consists of a red symbol, a blue symbol, and a box of any color.

In addition, there is the OR tile. For instance, "0: G OR X" means that all sequences are made up of one green symbol or one X

Finally, a Rule Row can be referenced in other Rows (or itself!). For instance, "0: G 1 OR X 2" means that a Good sequence is made up of a green symbol followed by whatever Row 1 says OR an X followed by whatever Row 2 says.

Each valid solution gets 50 points, minus one point per tile. For instance, if a solution has 8 tiles in total, the final score is 42.
