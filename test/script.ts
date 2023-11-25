import Maze from 'maze_simmulator';

const maze = new Maze(10, 10);

maze.generate().then(
    () => {
        maze.consoleDisplay();
    }
)