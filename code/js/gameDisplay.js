/*******************************************/
/*                TEMPLATES                */
/*******************************************/
recordMovementsButton = () => `
    <button class="record">
        <img src="./img/record.png">
    </button>
`;

commandsRecordingSection = () => `
    <div class="commands-recording">
        <hr>
        <div class="recording-panel">
            <i>Recording commands</i>
            <div class="commands-list"></div>
            <button class="run-command-list">Run all!</button>
        </div>
    </div>
`;


/*******************************************/
/*               DISPLAYING                */
/*******************************************/
function drawGrid() {
    let rows = game.grid.length;
    let columns = game.grid[0].length;

    for (let i = 0; i < rows; i++) {
        let rowCells = "";

        for (let j = 0; j < columns; j++) {
            let cellClass = "empty";

            // If there is an obstacle
            if (game.grid[i][j]) {
                cellClass = "filled";
            }

            rowCells += `<td class="cell ${cellClass}" data-x="${i}" data-y="${j}"></td>`;
        }

        $(".grid tbody").append(`<tr>${rowCells}</tr>`);
    }

    refresh();
}

function refresh() {
    let directionClass;

    switch (game.robot.direction) {
        case "N":
            directionClass = "up";
            break;
        case "E":
            directionClass = "right";
            break;
        case "S":
            directionClass = "down";
            break;
        case "W":
            directionClass = "left";
            break;
    }

    // We remove the current location of the robot
    $(".cell.robot-location").removeClass("robot-location up down left right");

    // We set the new location of the robot (no problem if it is
    // the same as before)
    $(`.cell[data-x="${game.robot.x}"][data-y="${game.robot.y}"]`)
        .addClass(`robot-location ${directionClass}`);
}


/*******************************************/
/*              CONFIGURATION              */
/*******************************************/
function configureRobotControls() {
    // If the function to execute multiple commands exists,
    // we add the 'record movements' button
    if (typeof executeMultipleCommands === "function") {
        $(".control-panel .move-buttons .middle-row .rotate-left").after(recordMovementsButton());
    }
}

function configureLog() {
    let containerHeight = $(".game-log").outerHeight();
    let headerHeight = $(".game-log .header").outerHeight();
    let listHeight = $(".game-log .messages-list").innerHeight();
    $(".game-log .messages-list").css("max-height", `${containerHeight - headerHeight - listHeight}px`);
    $(".game-log .header .clear-log").off("click").on("click", function() {
        $(".game-log .messages-list").empty();
    });

    // Override real log (source: https://stackoverflow.com/a/35449256/6279885)
    let realConsole = console.log;

    console.log = function() {
        for (let i = 0; i < arguments.length; i++) {
            $(".game-log .messages-list").append(`<span class="message">${arguments[i]}</span>`);
        }
        $(".game-log .messages-list").scrollTop(function() { return this.scrollHeight; });
        realConsole(...arguments);
    }
}

function setMoveButtonsFunctionality() {
    $(".control-panel .move-buttons .rotate-left").off("click").on("click", function() {
        if (typeof executeGameCommand === "function") {
            executeGameCommand(game, "l");
        } else if (typeof turnLeft === "function") {
            turnLeft(game.robot);
        } else {
            console.log("No function exists for left-rotating the robot yet");
        }
        refresh();
    });
    $(".control-panel .move-buttons .rotate-right").off("click").on("click", function() {
        if (typeof executeGameCommand === "function") {
            executeGameCommand(game, "r");
        } else if (typeof turnRight === "function") {
            turnRight(game.robot);
        } else {
            console.log("No function exists for right-rotating the robot yet");
        }
        refresh();
    });
    $(".control-panel .move-buttons .move-forward").off("click").on("click", function() {
        if (typeof executeGameCommand === "function") {
            executeGameCommand(game, "f");
        } else if (typeof moveForward === "function") {
            moveForward(game.robot, game.grid);
        } else {
            console.log("No function exists for moving forward the robot yet");
        }
        refresh();
    });
    $(".control-panel .move-buttons .move-backward").off("click").on("click", function() {
        if (typeof executeGameCommand === "function") {
            executeGameCommand(game, "b");
        } else if (typeof moveBackward === "function") {
            moveBackward(game.robot, game.grid);
        } else {
            console.log("No function exists for moving backward the robot yet");
        }
        refresh();
    });
    $(".control-panel .move-buttons .record").off("click").on("click", function() {
        $(this).off("click");
        $(this).addClass("pressed");
        $(".control-panel").append(commandsRecordingSection());
        setRecordingFunctionality();
    });
}

function unsetRecordingFunctionality() {
    setMoveButtonsFunctionality();
    $(".control-panel .move-buttons .record").removeClass("pressed");
    $(".control-panel .commands-recording").remove();
    $(".cell.programmed").removeClass("programmed");
}

function setRecordingFunctionality() {
    $(".commands-recording .recording-panel .run-command-list").off("click").on("click", function() {
        let commands = $(this).closest(".recording-panel").find(".commands-list").text();
        executeMultipleCommands(game, commands);
        refresh();
        unsetRecordingFunctionality();
    });
    $(".control-panel .move-buttons .record").off("click").on("click", function() {
        unsetRecordingFunctionality();
    });

    $(".cell.robot-location").addClass("programmed");

    let commandsList = $(".commands-recording .recording-panel .commands-list");
    let lastProgrammedPosition = {
        x: game.robot.x,
        y: game.robot.y,
        direction: game.robot.direction
    }

    $(".control-panel .move-buttons .rotate-left").off("click").on("click", function() {
        updateProgrammedDirection(lastProgrammedPosition, "l");
        commandsList.append("l");
    });
    $(".control-panel .move-buttons .rotate-right").off("click").on("click", function() {
        updateProgrammedDirection(lastProgrammedPosition, "r");
        commandsList.append("r");
    });
    $(".control-panel .move-buttons .move-forward").off("click").on("click", function() {
        updateProgrammedPosition(lastProgrammedPosition, "f");
        commandsList.append("f");
    });
    $(".control-panel .move-buttons .move-backward").off("click").on("click", function() {
        updateProgrammedPosition(lastProgrammedPosition, "b");
        commandsList.append("b");
    });
}

function updateProgrammedDirection(lastPosition, command) {
    switch (lastPosition.direction) {
        case "N":
            if (command === "l"){
                lastPosition.direction = "W";
            } else {
                lastPosition.direction = "E";
            }
            break;
        case "S":
            if (command === "l"){
                lastPosition.direction = "E";
            } else {
                lastPosition.direction = "W";
            }
            break;
        case "E":
            if (command === "l"){
                lastPosition.direction = "N";
            } else {
                lastPosition.direction = "S";
            }
            break;
        case "W":
            if (command === "l"){
                lastPosition.direction = "S";
            } else {
                lastPosition.direction = "N";
            }
            break;
    }
}

function updateProgrammedPosition(lastPosition, command) {
    let futureRow = lastPosition.x;
    let futureColumn = lastPosition.y;
    let maxRowIndex = game.grid.length - 1;
    let maxColumnIndex = game.grid[0].length - 1;

    switch (lastPosition.direction) {
        case "N":
            if (command === "f"){
                futureRow--;
            } else {
                futureRow++;
            }
            break;
        case "S":
            if (command === "f"){
                futureRow++;
            } else {
                futureRow--;
            }
            break;
        case "E":
            if (command === "f"){
                futureColumn++;
            } else {
                futureColumn--;
            }
            break;
        case "W":
            if (command === "f"){
                futureColumn--;
            } else {
                futureColumn++;
            }
            break;
    }

    if ((futureRow <= maxRowIndex) && (futureRow >= 0) &&
        (futureColumn <= maxColumnIndex) && (futureColumn >= 0) &&
        (!game.grid[futureRow][futureColumn])) {
        lastPosition.x = futureRow;
        lastPosition.y = futureColumn;
        $(`.cell[data-x="${lastPosition.x}"][data-y="${lastPosition.y}"]`).addClass("programmed");
    }
}