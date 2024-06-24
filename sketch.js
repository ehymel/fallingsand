let grid, emptyGrid;
let w = 5;
let cols, rows;
let fallingGrains = [];

function setup() {
    createCanvas(400, 400);
    cols = width / w;
    rows = height / w;
    grid = make2DArray(cols, rows);
}

function draw() {
    background(0);
    drawGrid();
    // fall();
    grainsFall();
}

function grainsFall() {
    let nextFallingGrains = [];
    let nextGrid = grid;
    for (let i = 0; i < fallingGrains.length; i++) {
        let grain = fallingGrains[i];
        let x = grain.locationX;
        let y = grain.locationY;

        if (y === rows - 1) {
            continue;
        }

        let below = nextGrid[x][y + 1];
        if (null === below) {
            ++grain.locationY;
            nextGrid[x][y] = null;
            nextGrid[x][y + 1] = grain;
            nextFallingGrains.push(grain);
            continue;
        }

        let belowA, belowB;
        let dir = random([-1, 1]);

        if (x + dir >= 0 && x - dir >= 0 && x + dir <= cols - 1 && x - dir <= cols -1) {
            belowA = nextGrid[x + dir][y + 1];
            belowB = nextGrid[x - dir][y + 1];
        }

        if (null === belowA) {
            grain.locationX = x + dir;
            grain.locationY = y + 1;
            nextGrid[x][y] = null;
            nextGrid[x + dir][y + 1] = grain;
            nextFallingGrains.push(grain);
        } else if (null === belowB) {
            grain.locationX = x - dir;
            grain.locationY = y + 1;
            nextGrid[x][y] = null;
            nextGrid[x - dir][y + 1] = grain;
            nextFallingGrains.push(grain);
        }
    }
    fallingGrains = nextFallingGrains;
    grid = nextGrid;
}

function fall() {
    let nextGrid = make2DArray(cols, rows);
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            if (1 === grid[i][j]) {
                let belowA, belowB;
                let dir = random([-1, 1]);

                if (i + dir >= 0 && i - dir >= 0 && i + dir <= cols - 1 && i - dir <= cols -1) {
                    belowA = grid[i + dir][j + 1];
                    belowB = grid[i - dir][j + 1];
                }

                if (0 === grid[i][j + 1]) {
                    nextGrid[i][j + 1] = 1;
                } else if (belowA === 0) {
                    nextGrid[i + dir][j + 1] = 1;
                } else if (belowB === 0) {
                    nextGrid[i - dir][j + 1] = 1;
                } else {
                    nextGrid[i][j] = 1;
                }
            }
        }
    }

    grid = nextGrid;
}

function drawGrid() {
    background(0);
    noStroke();
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            if (null !== grid[i][j]) {
                grain = grid[i][j];
                fill(grain.getColor());
                square(i * w, j * w, w);
            }
        }
    }
}

function mouseDragged() {
    let col = floor(mouseX / w);
    let row = floor(mouseY / w);
    if (col >= 0 && col <= cols -1 && row >= 0 && row <= rows -1 && grid[col][row] === null) {
        grain = new Grain(col, row);
        fallingGrains.push(grain);
        grid[col][row] = grain;
    }
}

function make2DArray(cols, rows) {
    let arr = new Array(cols);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows);
        for (let j = 0; j < arr[i].length; j++) {
            arr[i][j] = null;
        }
    }
    return arr;
}

class Grain {
    constructor(i, j) {
        this.locationX = i;
        this.locationY = j;
    }

    getColor() {
        return 'rgba(255, 255, 255, 1)';
    }
}