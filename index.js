const KEYS = [
    'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
    'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'ENTER',
    'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DEL',
]
const secret_word = "APPLE";

const grid = document.querySelector(".grid-container");
const keyboard = document.querySelector(".keyboard-container");
const messageDisplay = document.querySelector(".message-container");


// VARIABLES
let curr_row = 0;
let curr_tile = 0;
let isGameActive = true;
let keyboardColors = {};


// KEYBOARD
const handleKeyClick = (key) => {
    if (key === "DEL") {
        console.log(key);
        deleteLetter();
    }
    else if (key === "ENTER") {
        console.log(key);
        handleEnter();
    }
    else {
        console.log(key);
        addLetter(key);
    }
};

const addLetter = (letter) => {
    if (curr_tile < 5 && curr_row < 6 && isGameActive) {
        const tile = document.getElementById("row-idx-" + curr_row + "-tile-" + curr_tile);
        tile.textContent = letter;
        tile.setAttribute("data", letter);
        guess_grid[curr_row][curr_tile] = letter;
        curr_tile++;
    }
};

const deleteLetter = () => {
    if (curr_tile > 0 && curr_row >= 0 && isGameActive) {
        curr_tile--;
        const tile = document.getElementById("row-idx-" + curr_row + "-tile-" + curr_tile);
        tile.textContent = "";
        tile.removeAttribute("data");
        guess_grid[curr_row][curr_tile] = "";
    }
}

const handleEnter = () => {
    if (curr_tile < 5 && isGameActive) {
        showMessage("PLEASE ENTER A WORD")
        return;
    }

    if (curr_tile === 5 && isGameActive) {
        flipTiles();
        curr_guess = guess_grid[curr_row].join("");
        if (curr_guess === secret_word) {
            isGameActive = false;
            showMessage(`CORRECT, ANSWER WAS ${secret_word}`, "rgb(83, 141, 78)");
        }
        else {
            if (curr_row >= 5) {
                isGameActive = false;
                showMessage(`GAMEOVER, ANSWER WAS ${secret_word}`);
            } else {
                curr_row++;
                curr_tile = 0;
            }
        }
    }
};

// add keydown event listener
document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        handleEnter();
    }
    else if (e.key === "Backspace") {
        deleteLetter();
    }
    else if (e.key.length === 1 && e.key.match(/[a-zA-Z]/i)) {
        addLetter(e.key.toUpperCase());
    }
});

KEYS.map((key) => {
    const key_btn = document.createElement("button");
    keyboardColors[key] = "rgb(129, 131, 132)";
    key_btn.textContent = key;
    key_btn.setAttribute("id", key);
    key_btn.addEventListener("click", () => handleKeyClick(key));
    keyboard.append(key_btn);
});


// BUILD GRID
const guess_grid = [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
]

guess_grid.map((row, i) => {
    const row_ele = document.createElement("div");
    row_ele.setAttribute("id", "row-idx-" + i);

    row.map((guess_char, guess_char_idx) => {
        const tile_ele = document.createElement("div");
        tile_ele.setAttribute("id", "row-idx-" + i + "-tile-" + guess_char_idx);
        tile_ele.classList.add("tile");

        row_ele.append(tile_ele);
    });

    grid.append(row_ele);
});


let messageActive = false;
const showMessage = (message, color = "rgb(129, 131, 132)") => {
    if (!isGameActive) {
        const message_ele = document.createElement("p");
        message_ele.textContent = message;
        message_ele.style.backgroundColor = color;
        messageDisplay.append(message_ele);
        return;
    }
    
    if (!messageActive) {
        messageActive = true;
        const message_ele = document.createElement("p");
        message_ele.textContent = message;
        message_ele.style.backgroundColor = color;
        messageDisplay.append(message_ele);
        setTimeout(() => {
            messageDisplay.removeChild(message_ele);
            messageActive = false;
        }, 2000);
    }
};


const flipTiles = () => {
    const tiles = document.querySelector("#row-idx-" + curr_row);
    tiles.childNodes.forEach((tile, i) => {
        const letter = tile.getAttribute("data");
        const color = getColor(letter, i);
        tile.style.backgroundColor = color;
        updateKeyboardColor(letter, color);
    });
    flipKeyboard();
};


const flipKeyboard = () => {
    const keyboard = document.querySelector(".keyboard-container");
    keyboard.childNodes.forEach((button) => {
        let letter = button.id;
        button.style.backgroundColor = keyboardColors[letter];
    });
};


const getColor = (letter, i) => {
    // rgb(58, 58, 60) abscent
    // rgb(83, 141, 78) correct
    // rgb(181, 159, 59) incorrect
    if (secret_word.includes(letter)) {
        if (letter === secret_word[i]) {
            return "rgb(83, 141, 78)";
        } else {
            return "rgb(181, 159, 59)";
        }
    } else {
        return "rgb(58, 58, 60)";
    }
};


const updateKeyboardColor = (letter, color) => {
    // if color is green do nothing
    if (keyboardColors[letter] === "rgb(83, 141, 78)") {
        return;
    }
    keyboardColors[letter] = color;
};