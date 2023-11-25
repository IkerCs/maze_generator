interface Cell {
    x: number,
    y: number,
}

interface Maze {
    width: number,
    height: number,
    cells: number[][],
    start: Cell,
    finish: Cell,
}

export { Maze, Cell };
