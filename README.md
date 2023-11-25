
# Maze Simmulator

Simple Typescript Maze Generator for path solving algorithm practise



## Installation

Install maze_simmulator with npm

```bash
  npm install maze_simmulator
```
    
## Usage/Examples

#### Generate Maze
```typescript
import Maze from 'maze_simmulator'

const WIDTH = 10;
const HEIGHT = 15;

const maze = new Maze(WIDTH, HEIGHT);

(async () => {
    await maze.generate();
    maze.consoleDisplay();
})();

```

#### Getting a cell

```typescript
import Maze from 'maze_simmulator'

const WIDTH = 10;
const HEIGHT = 15;

const maze = new Maze(WIDTH, HEIGHT);

(async () => {
    await maze.generate();
    const cell = maze.getCell(5, 5); // Returns walls for the cell
    // (0 = NONE, 1 = UP, 2 = LEFT, 3 = UP AND LEFT)
    const moves = maze.availableMoves({ x: 7, y: 5 }); // [ { x: 6, y: 5 }, { x: 7, y: 6 } ]
    console.log(cell);
    console.log(moves);
})();

```