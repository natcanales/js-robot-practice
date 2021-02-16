function createGrid(rows = 10, columns = 10) {
    let matrix = [];

    if ((rows < 5) || (columns < 5)) {
        console.log(`The minimum grid's size is 5x5, but you provided ${rows}x${columns}`);
    } else {
        for (let i = 0; i < rows; i++) {
            let row = [];
            for (let j = 0; j < columns; j++) {
                row.push(false);
            }
            matrix.push(row);
        }
    }

    return matrix;
}

function turnLeft(robot) {
    switch (robot.direction) {
        case "N":
            robot.direction = "W";
            break;
        case "W":
            robot.direction = "S";
            break;
        case "S":
            robot.direction = "E";
            break;
        case "E":
            robot.direction = "N";
            break;
        default:
            console.log(`The robot's direction "${robot.direction}" is incorrect`);
            break;    
    }
}

function turnRight(robot) {
    switch (robot.direction) {
        case "N":
            robot.direction = "E";
            break;
        case "E":
            robot.direction = "S";
            break;
        case "S":
            robot.direction = "W";
            break;
        case "W":
            robot.direction = "N";
            break;
        default:
            console.log(`The robot's direction "${robot.direction}" is incorrect`);
            break;    
    }
}

function checkIfValidPosition(possiblePosition, grid) {
    if ((possiblePosition.x < 0) || (possiblePosition.x >= grid.length) ||
            (possiblePosition.y < 0) || (possiblePosition.y >= grid[0].length)) {
        console.log("Cannot move robot outside the grid!");
        return false;
    } else if (grid[possiblePosition.x][possiblePosition.y] === true) {
        console.log("The robot cannot run into an obstacle!");
        return false;
    }

    return true;
}

function moveForward(robot, grid) {
    let futureX = robot.x;
    let futureY = robot.y;
    
    switch (robot.direction) {
        case "N":
            futureX--;
            break;
        case "S":
            futureX++;
            break;
        case "E":
            futureY++;
            break;
        case "W":
            futureY--;
            break;
        default:
            console.log(`The robot's direction "${robot.direction}" is incorrect`);
            break;    
    }

    let possiblePosition = {
        x: futureX,
        y: futureY
    };
    let isValid = checkIfValidPosition(possiblePosition, grid);

    if (isValid) {
        robot.x = futureX;
        robot.y = futureY;
    }
    
}

function moveBackward(robot, grid) {
    let futureX = robot.x;
    let futureY = robot.y;

    switch (robot.direction) {
        case "N":
            futureX++;
            break;
        case "S":
            futureX--;
            break;
        case "E":
            futureY--;
            break;
        case "W":
            futureY++;
            break;
        default:
            console.log(`The robot's direction "${robot.direction}" is incorrect`);
            break;    
    }

    let possiblePosition = {
        x: futureX,
        y: futureY
    };
    let isValid = checkIfValidPosition(possiblePosition, grid);

    if (isValid) {
        robot.x = futureX;
        robot.y = futureY;
    }
}

function setObstacles(grid, obstacles) {
    obstacles.forEach(element => {
        if ((element.x >= 0) && (element.x < grid.length) &&
                (element.y >= 0) && (element.y < grid[0].length)) {
            grid[element.x][element.y] = true;
        } else {
            console.log(`Cannot set obstacle at x=${element.x}, y=${element.y}`);
        }
    });
}

function executeGameCommand(game, command) {
    switch (command) {
        case "l":
            turnLeft(game.robot);
            break;
        case "r":
            turnRight(game.robot);
            break;
        case "f":
            moveForward(game.robot, game.grid);
            break;
        case "b":
            moveBackward(game.robot, game.grid);
            break;
        default:
            console.log(`Unknown command: '${command}'`);
            break;
    }
}

function executeMultipleCommands(game, string) {
    if (typeof string !== "string") {
        console.log("Invalid commands!");
        return;
    }

    let spelledString = string.split("");

    spelledString.forEach(command => {
        executeGameCommand(game, command);
    });
}

let game = {
    grid: createGrid(),
    robot: {
        x: 0,
        y: 0,
        direction: "N"
    }
};

let obstacles =[
    {x: 2, y: 6},
    {x: 0, y: 3},
    {x: 1, y: 7},
    {x: 8, y: 1},
    {x: 5, y: 8},
    {x: 4, y: 2},
    {x: 3, y: 9},
    {x: 6, y: 4},
    {x: 7, y: 2},
    {x: 9, y: 5},
];

setObstacles(game.grid, obstacles);