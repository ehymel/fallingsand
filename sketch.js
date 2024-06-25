let grid, nextGrid;
let w = 5;
let cols, rows;
let fallingGrains = [];
let hueValue = 0;

function setup() {
    createCanvas(600, 800);
    colorMode(HSB, 360, 255, 255);
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
    nextGrid = grid;
    for (let i = 0; i < fallingGrains.length; i++) {
        let grain = fallingGrains[i];
        let x = grain.locationX;
        let y = grain.locationY;

        if (y === rows - 1) {
            grain.land();
            continue;
        }

        let below = grid[x][y + 1];
        if (null === below || below.isFalling) {
            grain.fall(x);
            nextFallingGrains.push(grain);
            continue;
        }

        let belowA, belowB;
        let dir = random([-1, 1]);

        if (x + dir >= 0 && x - dir >= 0 && x + dir <= cols - 1 && x - dir <= cols -1) {
            belowA = grid[x + dir][y + 1];
            belowB = grid[x - dir][y + 1];
        }

        if (null === belowA) {
            grain.fall(x + dir);
            nextFallingGrains.push(grain);
        } else if (null === belowB) {
            grain.fall(x - dir);
            nextFallingGrains.push(grain);
        } else {
            grain.land();
        }
    }
    fallingGrains = nextFallingGrains;
    grid = nextGrid;
}

function drawGrid() {
    background(0);
    noStroke();
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            if (null !== grid[i][j]) {
                grain = grid[i][j];
                fill(grain.hueValue, 255, 255);
                square(i * w, j * w, w);
            }
        }
    }
}

function mouseDragged() {
    let radius = 5;
    let extent = floor(radius / 2);
    let mouseCol = floor(mouseX / w);
    let mouseRow = floor(mouseY / w);

    for (let i = -extent; i < extent; i++) {
        for (let j = -extent; j < extent; j++) {
            if (random(1) < 0.6) {
                let col = mouseCol + i;
                let row = mouseRow + j;

                if (col >= 0 && col <= cols -1 && row >= 0 && row <= rows -1 && grid[col][row] === null) {
                    grain = new Grain(col, row);
                    fallingGrains.push(grain);
                    grid[col][row] = grain;
                }
            }
        }
    }
    hueValue = (hueValue + 2) % 360;
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
        this.hueValue = hueValue;
        this.isFalling = true;
    }

    fall(newLocationX) {
        nextGrid[this.locationX][this.locationY] = null;

        this.locationX = newLocationX;
        this.locationY += 1;
        this.isFalling = true;  // redundant, but keep for clarity

        nextGrid[this.locationX][this.locationY] = this;
    }

    land() {
        nextGrid[this.locationX][this.locationY] = this;
        this.isFalling = false;
    }
}