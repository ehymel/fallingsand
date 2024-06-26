let grid;
let w = 5;
let cols, rows;
let hueValue = 0;
let partitions = [];

function setup() {
    createCanvas(600, 800);
    colorMode(HSB, 360, 255, 255);
    cols = width / w;
    rows = height / w;
    grid = make2DArray(cols, rows);
    partitions = [new Partition(rows / 3, 3), new Partition(2 * rows / 3, 4)];
}

function draw() {
    background(0);
    drawGrid();
    fall();
}

function fall() {
    let nextGrid = make2DArray(cols, rows);
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            if (grid[i][j] > 0) {
                // if below bottom, then we've landed
                if (j + 1 === rows) {
                    nextGrid[i][j] = grid[i][j];
                    continue;
                }

                // if below is a partition, then we may have landed
                let landed = false;
                for (let k = 0; k < partitions.length; k++) {
                    landed = landed || partitions[k].checkLanding(i, j + 1);
                }
                if (landed) {
                    nextGrid[i][j] = grid[i][j];
                    continue;
                }

                // if below is empty, drop down
                if (0 === grid[i][j + 1]) {
                    nextGrid[i][j + 1] = grid[i][j];
                    continue;
                }

                // below is not empty, so try to fall to left or right (randomly) if possible
                let belowA, belowB;
                let dir = random([-1, 1]);

                // make sure we are checking something still on the screen
                if (i + dir >= 0 && i + dir <= cols - 1) {
                    belowA = grid[i + dir][j + 1];
                }
                if (i - dir >= 0 && i - dir <= cols -1) {
                    belowB = grid[i - dir][j + 1];
                }

                if (belowA === 0) {
                    nextGrid[i + dir][j + 1] = grid[i][j];
                } else if (belowB === 0) {
                    nextGrid[i - dir][j + 1] = grid[i][j];
                } else {
                    // can't fall to left or right, so we've landed
                    nextGrid[i][j] = grid[i][j];
                }
            }
        }
    }

    grid = nextGrid;
}

function drawGrid() {
    background(0);
    for (let i = 0; i < partitions.length; i++) {
        partitions[i].draw();
    }

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            noStroke();
            if (grid[i][j] > 0) {
                fill(grid[i][j], 255, 255);
                let x = i * w;
                let y = j * w;
                square(x, y, w);
            }
        }
    }
}

function mouseDragged() {
    let mouseCol = floor(mouseX / w);
    let mouseRow = floor(mouseY / w);

    let matrix = 9;
    let extent = floor(matrix / 2);
    for (let i = -extent; i < extent; i++) {
        for (let j = -extent; j < extent; j++) {
            if (random(1) < 0.6) {
                let col = mouseCol + i;
                let row = mouseRow + j;
                if (col >= 0 && col <= cols -1 && row >= 0 && row <= rows -1 && grid[col][row] === 0) {
                    grid[col][row] = hueValue;
                }
            }
        }
    }
    hueValue = (hueValue + 0.5) % 360;
}

function make2DArray(cols, rows) {
    let arr = new Array(cols);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows);
        for (let j = 0; j < arr[i].length; j++) {
            arr[i][j] = 0;
        }
    }
    return arr;
}

class Partition {
    constructor(row, holes) {
        this.row = floor(row);
        this.holes = holes;
        this.holeSize = 4;
        this.segmentLength = floor((cols - (this.holeSize * this.holes)) / (this.holes + 1));
        this.holeCols = this.holePositions();
    }

    draw() {
        stroke(255);
        strokeWeight(w / 2);

        for (let i = 0; i <= this.holes; i++) {
            let segmentStart = i * (this.segmentLength + this.holeSize);
            let segmentEnd = segmentStart + this.segmentLength;
            line(segmentStart * w, this.row * w, segmentEnd * w, this.row * w);
        }
    }

    holePositions() {
        let holeCols = [];
        // return col numbers of each hole
        for (let i = 1; i <= this.holes; i++) {
            let holeStart = i * this.segmentLength;
            let holeEnd = holeStart + this.holeSize;
            for (let j = holeStart; j < holeEnd; j++) {
                holeCols.push(j);
            }
        }
        return holeCols;
    }

    checkLanding(col, row) {
        if (row === this.row) {
            return this.holeCols.indexOf(col) < 0;
        }

        return false;
    }
}