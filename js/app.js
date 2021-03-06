// VIEW

var view = {
    displayMessage: function(msg){
        var messageArea = document.querySelector('#messageArea');
        messageArea.innerHTML = msg;
    },

    displayHit: function(location){
        var area = document.getElementById(location);
        area.setAttribute("class", "hit");
    },

    displayMiss: function(location){
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }
};

// MODEL

var model = {
    boardSize: 7, 
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,

    ships: [
        ship1 = { location: ['0', '0', '0'], hits: ['', '', '']},
        ship2 = { location: ['0', '0', '0'], hits: ['', '', '']},
        ship3 = { location: ['0', '0', '0'], hits: ['', '', '']}
        ],

    fire: function(guess){ // Check hit and whether destroyed ship
        for(let i = 0; i < this.numShips; i++){
            var ship = this.ships[i];
            var index = ship.location.indexOf(guess);
            if (index >= 0){
                ship.hits[index] = 'hit';
                view.displayHit(guess);
                view.displayMessage('HIT!!!');
                if(this.isSunk(ship)){
                    view.displayMessage('We killed him!');
                    this.shipsSunk++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage('It was mistake!');
        return false;
    },
    
    isSunk: function(ship){ // Check damages of ship
        for(var i = 0; i < this.shipLength; i++){
            if(ship.hits[i] !== 'hit'){
                return false;
            }
        }
        return true;
    },

    generateShipLocations: function(){ // Generate ships on gameboard
        var location;
        for(var i = 0; i < this.numShips; i++){
            do{
                location = this.generateShip();
            }while(this.collision(location)); // Stop, when distance between ships will be normal
            this.ships[i].location = location;
        }
    },

    generateShip: function(){ // Generate random coordinate for every ship
        var direction = Math.floor(Math.random() * 2);
        var row, col;

        if(direction === 1){ // Random choi??e axis
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
        }else{
            col = Math.floor(Math.random() * this.boardSize);
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
        }

        var newShipLocation = [];

        for(var i = 0; i < this.shipLength; i++){ // Create coordinate
            if(direction === 1){
                newShipLocation.push(row + '' + (col + i));
            }else{
                newShipLocation.push((row + i) + '' + col);
            }
        }
        return newShipLocation;
    },

    collision: function(locations){ // Check distance between ships
        for(var i = 0; i < this.numShips; i++){
            var ship = model.ships[i];
            for(var j = 0; j < locations.length; j++){
                if (ship.location.indexOf(locations[j]) >= 0){
                    return true;
                }
            }
        }
        return false;
    }
}

// CONTROL

var controller = {
    gusses: 0,

    processGuess: function(guess){ // Show player result, when he win
        var location = parseGuess(guess);
        if (location){
            this.gusses++;
            var hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips){
                view.displayMessage(`${this.gusses} fires! You win!`);
            }
        }
    }
}

function parseGuess(guess){ // Check correct users coordinate
    var alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

    if (guess.search(/[A-G][0-6]/) !== -1){
        firstChar = guess.charAt(0);
        var row = alphabet.indexOf(firstChar);
        var column = guess.charAt(1);
        return row + column;
    };
    alert('Not correct input.');
    return null;
};

function init(){
    var fireButton = document.getElementById('fireButton');
    fireButton.onclick = handleFireButton;
    // Work with keyboard
    var guessInput = document.getElementById('guessInput');
    guessInput.onkeypress = handleKeyPress;

    model.generateShipLocations();
}

function handleFireButton(){
    var guessInput = document.getElementById('guessInput');
    var guess = guessInput.value;
    controller.processGuess(guess);
    guessInput.value = '';
}

function handleKeyPress(e){
    var fireButton = document.getElementById('fireButton');
    if(e.keyCode === 13){
        fireButton.click();
        return false;
    }
}

window.onload = init();