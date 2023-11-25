import Maze from './Maze';

const maze = new Maze(15, 15);

maze.generate(false).then(() => {
    maze.consoleDisplay();
})