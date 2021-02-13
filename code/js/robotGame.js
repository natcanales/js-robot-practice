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

let game = {
    grid: createGrid(),
    robot: {
        x: 0,
        y: 0,
        direction: "N"
    }
};

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

function moveForward(robot) {
    switch (robot.direction) {
        case "N":
            robot.x--;
            break;
        case "S":
            robot.x++;
            break;
        case "E":
            robot.y++;
            break;
        case "W":
            robot.y--;
            break;
        default:
            console.log(`The robot's direction "${robot.direction}" is incorrect`);
            break;    
    }
}

function moveBackward(robot) {
    switch (robot.direction) {
        case "N":
            robot.x++;
            break;
        case "S":
            robot.x--;
            break;
        case "E":
            robot.y--;
            break;
        case "W":
            robot.y++;
            break;
        default:
            console.log(`The robot's direction "${robot.direction}" is incorrect`);
            break;    
    }
}

// Next statement: 7.