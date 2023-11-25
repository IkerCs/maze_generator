import { Cell } from "./@types/cells";

class Maze {

    width: number;
    height: number;
    cells: number[][];
    start: Cell;
    finish: Cell;

    constructor (width: number, height: number) {
        this.width = width;
        this.height = height;
        this.cells = [];
        this.start = { x: 0, y: 0 };
        this.finish = { x: this.width - 1, y: this.height - 1 };
    }

    #NO_WALL = 0b0000;
    #FRONT_WALL = 0b0001;
    #LEFT_WALL = 0b0010;

    generate (consoleDisplay: boolean = false) {
        for (let y = 0; y < this.height; y++) {
            this.cells.push([]);
            for (let x = 0; x < this.width; x++) {
                this.cells[y].push(this.#NO_WALL);
            }
        }

        return new Promise(async (r) => {
            this.#createWalls(consoleDisplay).then(() => {
                r(true);
            })
        })
    }

    getRandomCell () {
        return {
            x: Math.floor(Math.random() * this.width),
            y: Math.floor(Math.random() * this.height)
        } as Cell;
    }

    async #createWalls(consoleDisplay: boolean = false) {
        // Depth first algorithm: https://en.wikipedia.org/wiki/Maze_generation_algorithm#Depth-first_search
        // Algorithm implementation by Iker Cossio 
        
        let visited: Cell[] = [],
            created: Cell[] = [ { x: 0, y: 0 } ],
            current: Cell = { x: 0, y: 0 },
            previous: Cell = { x: 0, y: 0 },
            next: Cell = { x: 0, y: 0 };

        return new Promise(async (r) => {

            while (visited.length != this.width * this.height) {

                if (consoleDisplay) this.consoleDisplay(current, visited, created);
                let availables = this.availableMoves(current);
                let notCreated = availables.filter((cell) => !created.some((c) => c.x == cell.x && c.y == cell.y));
                let sourronding = this.#sourrondingCells(current);
    
                if (notCreated.length > 0) {
                    next = notCreated[Math.floor(Math.random() * notCreated.length)];
                    let currentEmpty = created.some((c) => c.x == current.x && c.y == current.y);
                    if (currentEmpty && previous.x == current.x && previous.y == current.y - 1) {
                        this.cells[current.y][current.x] |= this.#LEFT_WALL;
                        if ((current.y + 1) < this.height) this.cells[current.y + 1][current.x] |= this.#FRONT_WALL;
                        if ((current.x + 1) < this.width) this.cells[current.y][current.x + 1] |= this.#LEFT_WALL;               
                    } else if (currentEmpty && previous.x == current.x && previous.y == current.y + 1) {
                        this.cells[current.y][current.x] |= this.#FRONT_WALL;
                        this.cells[current.y][current.x] |= this.#LEFT_WALL;
                        if (current.x + 1 < this.width) this.cells[current.y][current.x + 1] |= this.#LEFT_WALL;
                    } else if (currentEmpty && previous.x == current.x - 1 && previous.y == current.y) {
                        this.cells[current.y][current.x] |= this.#FRONT_WALL;
                        if ((current.y + 1) < this.height) this.cells[current.y + 1][current.x] |= this.#FRONT_WALL;
                        if ((current.x + 1) < this.width) this.cells[current.y][current.x + 1] |= this.#LEFT_WALL;
                    } else if (currentEmpty && previous.x == current.x + 1 && previous.y == current.y) {
                        this.cells[current.y][current.x] |= this.#FRONT_WALL;
                        this.cells[current.y][current.x] |= this.#LEFT_WALL;
                        if ((current.y + 1) < this.height) this.cells[current.y + 1][current.x] |= this.#FRONT_WALL;
                    }
    
                    if (next.x == current.x && next.y == current.y - 1) {
                        this.cells[current.y][current.x] &= ~this.#FRONT_WALL;
                    } else if (next.x == current.x && next.y == current.y + 1) {
                        this.cells[current.y + 1][current.x] &= ~this.#FRONT_WALL;
                    } else if (next.x == current.x - 1 && next.y == current.y) {
                        this.cells[current.y][current.x] &= ~this.#LEFT_WALL;
                    } else if (next.x == current.x + 1 && next.y == current.y) {
                        this.cells[current.y][current.x + 1] &= ~this.#LEFT_WALL;
                    }
    
                    previous = current;
                    current = next;
                    created.push(current);
                } else {
                    let emptySourronding = sourronding.filter((cell) => !created.some((c) => c.x == cell.x && c.y == cell.y));
    
                    if (emptySourronding.length == 0) {
                        if (visited.find((c) => c.x == previous.x && c.y == previous.y)) {
                            next = this.availableMoves(current).find((cell) => !visited.some((c) => c.x == cell.x && c.y == cell.y)) as Cell;
                            visited.push(current);
                            previous = current;
                            current = next;
                        } else {
                            next = this.availableMoves(current)[0];
                            visited.push(current);
                            previous = current;
                            current = next;
                        }
                    } else {
                        next = emptySourronding[Math.floor(Math.random() * emptySourronding.length)];
    
                        if (next.x == current.x && next.y == current.y - 1) {
                            this.cells[current.y][current.x] &= ~this.#FRONT_WALL;
                        } else if (next.x == current.x && next.y == current.y + 1) {
                            this.cells[current.y + 1][current.x] &= ~this.#FRONT_WALL;
                        } else if (next.x == current.x - 1 && next.y == current.y) {
                            this.cells[current.y][current.x] &= ~this.#LEFT_WALL;
                        } else if (next.x == current.x + 1 && next.y == current.y) {
                            this.cells[current.y][current.x + 1] &= ~this.#LEFT_WALL;
                        }
        
                        previous = current;
                        current = next;
                        created.push(current);
                    }
                }
    
                if (consoleDisplay) await new Promise(rs => setTimeout(rs, 10));
            }

            r(true);
     
        })
   }

    #sourrondingCells (cell: Cell) {
        let cells: Cell[] = [];
        const { x, y } = cell;

        if (x != 0) cells.push({ x: x - 1, y });
        if (y != 0) cells.push({ x, y: y - 1 });
        if ((x + 1) < this.width) cells.push({ x: x + 1, y });
        if ((y + 1) < this.height) cells.push({ x, y: y + 1 });

        return cells;
    }

    availableMoves(cell: Cell) {
        let moves: Cell[] = [];
        const { x, y } = cell;
        const binaryCell = this.cells[y][x];

        if (!(binaryCell & this.#LEFT_WALL) && x != 0) moves.push({ x: x - 1, y });
        if (!(binaryCell & this.#FRONT_WALL) && y != 0) moves.push({ x, y: y - 1 });
        if ((x + 1) < this.width && !(this.cells[y][x + 1] & this.#LEFT_WALL)) moves.push({ x: x + 1, y });
        if ((y + 1) < this.height && !(this.cells[y + 1][x] & this.#FRONT_WALL)) moves.push({ x, y: y + 1 });

        return moves;
    }

    #binaryDisplay () {
        let out = '';
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x ++) {
                out += this.cells[y][x].toString(2).padStart(4, '0') + ' ';
            }
            out += '\n';
        }
        console.log(out);
    }

    consoleDisplay(current: Cell | null = null, leaveTrack: Cell[] = [], leaveTrack2: Cell[] = []) {
        let out = '+---'.repeat(this.width);
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (y != 0 && (this.cells[y][x] & this.#FRONT_WALL)) out += '+---';
                if (y != 0 && !(this.cells[y][x] & this.#FRONT_WALL)) out += '+   ';
            }
            out += '+\n';


            out += '|';
            for (let x = 0; x < this.width; x++) {
                if (x != (0) && (this.cells[y][x] & this.#LEFT_WALL)) out += '|';
                if (x != (0) && !(this.cells[y][x] & this.#LEFT_WALL)) out += ' ';

                if (current && current.x == x && current.y == y) out += '🐢 '
                else if (this.finish.x == x && this.finish.y == y) out += '🏁 '
                else if (this.start.x == x && this.start.y == y) out += '🚩 '
                else if (leaveTrack.some((cell) => cell.x == x && cell.y == y)) out += '🟩 ';
                else if (leaveTrack2.some((cell) => cell.x == x && cell.y == y)) out += '🟦 ';
                else out += '   ';
            
            }
            out += '|';
            out += '\n';
        }
        out += '+---'.repeat(this.width) + '+';
        console.log(out);
    }

}

export default Maze;
