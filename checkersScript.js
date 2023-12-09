// get the form data from options.html
var boardSize;
var boardColorDark;
var boardColorLight;
var player1Color;
var player2Color;
var gameMode;
var gameDisplay = document.getElementsByClassName('gameDisplay')[0];
gameDisplay.style.display = 'none';

document.querySelector('form').addEventListener('submit', function(event) {
    // Prevent the form from being submitted to a server
    event.preventDefault();

    // Get the values of the selected options
    boardSize = document.querySelector('input[name="boardSize"]:checked').value;
    boardColorDark = document.getElementById('darkSquareColor').value;
    boardColorLight = document.getElementById('lightSquareColor').value;
    player1Color = document.getElementById('player1Color').value;
    player2Color = document.getElementById('player2Color').value;
    gameMode = document.querySelector('input[name="gameMode"]:checked').value;

    // Use the values
    console.log(boardSize, boardColorDark, boardColorLight, player1Color, player2Color, gameMode);
    optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = "";
    startGame();
});
// set rows and columns based on boardSize

function startGame(){
    gameDisplay.style.display = 'block';

    console.log("original color",boardColorDark);
    // Convert hex to RGB
    var r = parseInt(boardColorDark.slice(1, 3), 16);
    var g = parseInt(boardColorDark.slice(3, 5), 16);
    var b = parseInt(boardColorDark.slice(5, 7), 16);

    // Make the color lighter (you can adjust the values as needed)
    var lighterR = Math.min(255, r + 80); // Increase the red value
    var lighterG = Math.min(255, g + 80); // Increase the green value
    var lighterB = Math.min(255, b + 80); // Increase the blue value

    // Convert RGB back to hex
    var highlightColor = '#' + (1 << 24 | lighterR << 16 | lighterG << 8 | lighterB).toString(16).slice(1);

    console.log("new color",highlightColor);
    var rows;
    var columns;
    if(boardSize == '8x8'){
        rows = 8;
        columns = 8;
    }
    else if(boardSize == "10x10"){
        rows = 10;
        columns = 10;
    }

    var makingMove = false;
    createBoard(rows, columns);
    makePawns(rows, columns);
    var allSquares = document.getElementsByClassName("square");
    colorBoard();
    // console.log(allSquares);
    var gameBoard = [] 
    var blackPawns = []
    var blackHtmlPawns = document.getElementsByClassName("black");
    //console.log(blackHtmlPawns);
    var redPawns = []
    var redHtmlPawns = document.getElementsByClassName("red");
    //console.log(redHtmlPawns);
    colorPawns();

    // global variables to keep track of game logic
    var currTurn = "red";
    var gPawn;
    var currAttackedPawns = [];
    var attackingSquares = [];
    var attackingSquare = -1;
    // make the board the right size with css
    let board = document.getElementById('board');
    board.style.gridTemplateColumns = `repeat(${columns}, 50px)`;
    board.style.gridTemplateRows = `repeat(${rows}, 50px)`;

    // Select display elements
    let redPiecesDisplay = document.getElementById('redPiecesDisplay');
    let blackPiecesDisplay = document.getElementById('blackPiecesDisplay');
    let timer = document.getElementById('timerDisplay');
    // Change innerHTML of the display elements
    redPiecesDisplay.innerHTML = redPawns.length;
    blackPiecesDisplay.innerHTML = blackPawns.length;

    // set color of the board based on inputs
    // loop through all squares and set the color
    function colorBoard(){
        let n = Math.sqrt(allSquares.length); // Assuming your board is a square
        for(let i = 0; i < allSquares.length; i++){
            let currRow = Math.floor(i / n);
            if(i % 2 == currRow % 2){
                allSquares[i].style.backgroundColor = boardColorLight;
            }
            else{
                allSquares[i].style.backgroundColor = boardColorDark;
            }
        }
    }

    function colorPawns(){
        // set color of the pawns based on inputs
        for(let i = 0; i < blackHtmlPawns.length; i++){
            blackHtmlPawns[i].style.backgroundColor = player2Color;
        }
        for(let i = 0; i < redHtmlPawns.length; i++){
            redHtmlPawns[i].style.backgroundColor = player1Color;
        }
    }

    class Square{
        constructor(htmlRef, index){
            this.id = htmlRef;
            this.index = index;
            this.hasPawn = false;
            this.pawnID = undefined
            this.id.onclick = function(){
                //console.log("clicked square");
                moveTo(this);
            }
        }
    };

    class Pawn{
        constructor(htmlRef, color, square){
            this.id = htmlRef;
            //console.log(this.id);
            this.isKing = false;
            this.color = color;
            this.square = square;
            this.isActive = true;
            this.canAttack = false;
            this.index = square.index;
            this.id.onclick = function(){
                gPawn = this;
                //console.log("clicked pawn", this);
                showMoves(this);
            }
        }
    };

    function moveTo(clickedSquare){
        console.log("moveTo called");
        console.log("makingMove:", makingMove);
        console.log("hasHighlight:", clickedSquare.classList.contains("highlight"));
        console.log("hasChildNodes:", clickedSquare.hasChildNodes());
        if(makingMove && clickedSquare.classList.contains("highlight") && clickedSquare.hasChildNodes() == false){
            makingMove = false;
            console.log("trying to move to: ", clickedSquare);
            clickedSquare.appendChild(gPawn);
            // //console.log(gPawn);
            // Check if the clicked square is in the list of attacking squares
            let index = attackingSquares.indexOf(clickedSquare);
            if(index != -1){
                // If it is, remove the corresponding attacked pawn
                let attackedPawn = currAttackedPawns[index];
                if(attackedPawn.classList.contains('black')){
                    console.log("removing black pawn");
                    let pawnIndex = blackPawns.indexOf(attackedPawn);
                    blackPawns.splice(pawnIndex, 1);
                    console.log("blackPawns", blackPawns);
                }
                else if(attackedPawn.classList.contains('red')){
                    console.log("removing red pawn");
                    let pawnIndex = redPawns.indexOf(attackedPawn);
                    redPawns.splice(pawnIndex, 1);
                }
                // remove the pawn from the board
                attackedPawn.parentNode.removeChild(attackedPawn);
                // reset the attacking square and attacked pawn arrays
                currAttackedPawns = [];
                attackingSquares = [];
                attackingSquare = -1;

            // check if the pawn can attack again
                if(checkRetakes(clickedSquare)){
                    unhighlight();
                    console.log("can take again"); 
                    makingMove = true;
                    highlightRetakes();
                    if(currTurn == 'black' && gameMode == 'pvc'){
                        moveTo(attackingSquares[0]);
                    }
                }
            }
            // if the pawn is at the end of the board, make it a king
            console.log(clickedSquare.id[0]);
            //log the color of the pawn using classList
            console.log();

            if(clickedSquare.id[0] == 0 && gPawn.classList.contains('red')){
                console.log("making red pawn king");
                gPawn.classList.add('king');
                gPawn.isKing = true;
            }
            if(clickedSquare.id[0] == 7 && gPawn.classList.contains('black')){
                console.log("making black pawn king");
                gPawn.classList.add('king');
                gPawn.isKing = true;
                console.log(gPawn.isKing);
            }
            if(!makingMove){
                unhighlight();
                toggleTurn();
                makeBlackMove();
                checkGameOver();
            }
        }
        // Change innerHTML of the display elements
        redPiecesDisplay.innerHTML = redPawns.length;
        blackPiecesDisplay.innerHTML = blackPawns.length;
    }

    
    function canMoveToSquare(currIndex, direction, enemyColor) {
        // Get the ID of the square in the given direction
        console.log("canMoveToSquare", currIndex, direction, enemyColor);
        let newSquare = getSquare(currIndex, direction);
    
        // If the square exists (i.e., it's not off the board)
        if(newSquare != -1){
            // Get the HTML element of the square
            let newSquareElement = document.getElementById(newSquare);
    
            // If the square is empty
            if(!newSquareElement.hasChildNodes()){
                // The pawn can move to this square
                return true;
            }
            else{
                // If the square is not empty, get the pawn in the square
                let newSquarePawn = newSquareElement.firstChild;
                // If the pawn in the square is an enemy pawn
                if(newSquarePawn.classList.contains(enemyColor)){
                    // Get the ID of the square in the given direction again
                    let newSquare = getSquare(currIndex, direction);
    
                    // If the square exists
                    if(newSquare != -1){
                        // Get the HTML element of the square
                        let newSquareElement = document.getElementById(newSquare);
    
                        // If the square is empty
                        if(!newSquareElement.hasChildNodes()){
                            // The pawn can move to this square
                            return true;
                        }
                    }
                }
            }
        }
    
        // If none of the above conditions were met, the pawn cannot move to the square
        return false;
    }

    var intervalId;
    let time = 0;
    function startTimer() {
        clearInterval(intervalId); // Clear the existing interval
        time = 0; // Reset the time
        timer.textContent = time; // Update the timer display

        // Start a new interval
        intervalId = setInterval(function() {
            time++;
            timer.textContent = time;
        }, 1000);
    }
    startTimer();

    function canAttack(currSquare, direction1, direction2, enemyColor) {
        // Get the ID of the square one step away in the given direction
        let square1 = getSquare(currSquare.id, direction1);
        // Get the ID of the square two steps away in the given direction
        let square2 = getSquare(square1, direction2);

        // Check if the square one step away is valid
        if (square1 != -1) {
            // Get the element of the square one step away
            let square1Element = document.getElementById(square1);
            // Check if the square one step away has a child node (i.e., a pawn)
            if (square1Element.hasChildNodes()) {
                // Check if the pawn in the square one step away is of the enemy color
                if (square1Element.firstChild.classList.contains(enemyColor)) {
                    // Check if the square two steps away is valid
                    if (square2 != -1) {
                        // Get the element of the square two steps away
                        let square2Element = document.getElementById(square2);

                        // Check if the square two steps away doesn't have a child node (i.e., is empty)
                        if (!square2Element.hasChildNodes()) {
                            // If all conditions are met, the pawn can attack
                            return true;
                        }
                    }
                }
            }
        }
        // If any of the conditions is not met, the pawn can't attack
        return false;
    }
    
    function checkBlackKingAttacks(currSquare) {
        return canAttack(currSquare, 'upLeft', 'upLeft', 'red') ||
               canAttack(currSquare, 'upRight', 'upRight', 'red') ||
               canAttack(currSquare, 'downLeft', 'downLeft', 'red') ||
               canAttack(currSquare, 'downRight', 'downRight', 'red');
    }
    
    function checkRedKingAttacks(currSquare) {
        return canAttack(currSquare, 'upLeft', 'upLeft', 'black') ||
               canAttack(currSquare, 'upRight', 'upRight', 'black') ||
               canAttack(currSquare, 'downLeft', 'downLeft', 'black') ||
               canAttack(currSquare, 'downRight', 'downRight', 'black');
    }
    
    function checkBlackPawnAttacks(currSquare) {
        return canAttack(currSquare, 'downLeft', 'downLeft', 'red') ||
               canAttack(currSquare, 'downRight', 'downRight', 'red');
    }
    
    function checkRedPawnAttacks(currSquare) {
        return canAttack(currSquare, 'upLeft', 'upLeft', 'black') ||
               canAttack(currSquare, 'upRight', 'upRight', 'black');
    }

    function checkRetakes(clickedSquare){
        console.log("checkRetakes");
        //if the pawn is a red king
        if(gPawn.classList.contains('red') && gPawn.classList.contains('king')){
            console.log("red king");
            let currSquare = gPawn.parentNode;
            return checkRedKingAttacks(currSquare);
        }
        //if the pawn is a black king
        else if(gPawn.classList.contains('black') && gPawn.classList.contains('king')){
            console.log("black king");
            let currSquare = gPawn.parentNode;
            return checkBlackKingAttacks(currSquare);
        }
        //if the pawn is a black pawn
        else if(gPawn.classList.contains('black')){
            console.log("black pawn");
            let currSquare = gPawn.parentNode;
            return checkBlackPawnAttacks(currSquare);
        }
        //if the pawn is a red pawn
        else if(gPawn.classList.contains('red')){
            console.log("red pawn");
            let currSquare = gPawn.parentNode;
            return checkRedPawnAttacks(currSquare);
        }

    }

    function tryHighlightAttack(currSquare, direction1, direction2, color) {
        console.log("tryHighlightAttack");

        // Get the ID of the square one step away in the given direction
        let square1 = getSquare(currSquare.id, direction1);

        // Check if the square one step away is valid
        if (square1 != -1) {
            // Get the element of the square one step away
            let square1Element = document.getElementById(square1);

            // Check if the square one step away has a child node (i.e., a pawn)
            if (square1Element.hasChildNodes()) {
                // Check if the pawn in the square one step away is of the specified color
                if (square1Element.firstChild.classList.contains(color)) {
                    // Get the ID of the square two steps away in the given direction
                    let square2 = getSquare(square1, direction2);

                    // Check if the square two steps away is valid
                    if (square2 != -1) {
                        // Get the element of the square two steps away
                        let square2Element = document.getElementById(square2);

                        // Check if the square two steps away doesn't have a child node (i.e., is empty)
                        if (!square2Element.hasChildNodes()) {
                            // If all conditions are met, highlight the square two steps away and set the current attacked pawn and attacking square
                            square2Element.classList.replace('dark', 'highlight');
                            // change the color of the highlighted square
                            highlightSquare(square2Element);
                            // add the pawn to the array of attacked pawns
                            currAttackedPawns.push(square1Element.firstChild);
                            // add the square to the array of attacking squares
                            attackingSquares.push(square2Element);
                            console.log("attackingSquare:", attackingSquare);
                        }
                    }
                }
            }
        }
    }
    function highlightSquare(square){
        console.log("highlightSquaredsadasdasdasdasdasda", square);
        square.style.backgroundColor = highlightColor;
    }
    function highlightRedKingAttacks(currSquare) {
        tryHighlightAttack(currSquare, 'upLeft', 'upLeft', 'black');
        tryHighlightAttack(currSquare, 'upRight', 'upRight', 'black');
        tryHighlightAttack(currSquare, 'downLeft', 'downLeft', 'black');
        tryHighlightAttack(currSquare, 'downRight', 'downRight', 'black');
    }
    
    function highlightBlackKingAttacks(currSquare) {
        tryHighlightAttack(currSquare, 'upLeft', 'upLeft', 'red');
        tryHighlightAttack(currSquare, 'upRight', 'upRight', 'red');
        tryHighlightAttack(currSquare, 'downLeft', 'downLeft', 'red');
        tryHighlightAttack(currSquare, 'downRight', 'downRight', 'red');
    }
    
    function highlightBlackPawnAttacks(currSquare){
        tryHighlightAttack(currSquare, 'downLeft', 'downLeft', 'red');
        tryHighlightAttack(currSquare, 'downRight', 'downRight', 'red');
    }
    
    function highlightRedPawnAttacks(currSquare){
        tryHighlightAttack(currSquare, 'upLeft', 'upLeft', 'black');
        tryHighlightAttack(currSquare, 'upRight', 'upRight', 'black');
    }

    function highlightRetakes(){
        console.log("highlightRetakes");
        //if the pawn is a red king
        if(gPawn.classList.contains('red') && gPawn.classList.contains('king')){
            console.log("red king");
            let currSquare = gPawn.parentNode;
            highlightRedKingAttacks(currSquare);
        }
        //if the pawn is a black king
        else if(gPawn.classList.contains('black') && gPawn.classList.contains('king')){
            console.log("black king");
            let currSquare = gPawn.parentNode;
            highlightBlackKingAttacks(currSquare);
        }
        //if the pawn is a black pawn
        else if(gPawn.classList.contains('black')){
            console.log("black pawn");
            let currSquare = gPawn.parentNode;
            highlightBlackPawnAttacks(currSquare);
        }
        //if the pawn is a red pawn
        else if(gPawn.classList.contains('red')){
            console.log("red pawn");
            let currSquare = gPawn.parentNode;
            highlightRedPawnAttacks(currSquare);
        }
    }
    function showMoves(pawn){
        unhighlight();
        console.log("showing moves for pawn:", pawn);
        //console.log("currTurn:", currTurn);
        currAttackedPawn = -1;
        
        if(pawn.classList.contains('black') && currTurn == 'black'){
            //console.log("black pawn clicked");
            makingMove = true;
            let currSquare = pawn.parentNode;
            highlight(currSquare);
        }
        if(pawn.classList.contains('red') && currTurn == 'red'){
            //console.log("red pawn clicked");
            makingMove = true;
            let currSquare = pawn.parentNode;
            highlight(currSquare);
        }
    }

    function unhighlight(){
        //console.log("unhighlighting");
        for(let j = 0; j < rows; j++){ 
            for(let i = 0; i < columns; i++){
                // change the color of the highlighted square
                if(gameBoard[j][i].id.classList.contains('highlight')){
                    gameBoard[j][i].id.style.backgroundColor = boardColorDark;
                }
                gameBoard[j][i].id.classList.replace('highlight', 'dark');
                
            }
        }
    }

    function checkGameOver(){
        // if there are no more red pawns, black wins
        if(redPawns.length == 0){
            alert("Black wins! There are no more red pawns");
        }
        // if there are no more black pawns, red wins
        else if(blackPawns.length == 0){
            alert("Red wins! There are no more black pawns");
        }
        // if there are no more moves for red, black wins
        // else if(!redPawns.some(canMoveRed)){
        //     console.log("no moves for red");
        //     alert("Black wins! There are no more moves for red");
        // }
        // // if there are no more moves for black, red wins
        // else if(!blackPawns.some(canMoveBlack)){
        //     console.log("no moves for black");
        //     alert("Red wins! There are no more moves for black");
        // }
    }
    function toggleTurn(){
        if(currTurn == 'black'){
            currTurn = 'red';
        }
        else{
            currTurn = 'black';
        }
        console.log("called current turn:",currTurn);
        let turnDisplay = document.getElementById('turnDisplay');
        turnDisplay.innerHTML = currTurn;
    }

    function tryHighlight(sqr, direction1, direction2, enemyColor) {
        // Get the ID of the square one step away in the given direction
        let square1 = getSquare(sqr.id, direction1);

        // Get the ID of the square two steps away in the given direction
        let square2 = getSquare(square1, direction2);

        // Check if the square one step away is valid
        if (square1 != -1) {
            // Get the element of the square one step away
            let square1Element = document.getElementById(square1);

            // Check if the square one step away has a child node (i.e., a pawn)
            if (square1Element.hasChildNodes()) {
                // Check if the pawn in the square one step away is of the enemy color
                if (square1Element.firstChild.classList.contains(enemyColor)) {
                    // Check if the square two steps away is valid
                    if (square2 != -1) {
                        // Get the element of the square two steps away
                        let square2Element = document.getElementById(square2);

                        // Check if the square two steps away doesn't have a child node (i.e., is empty)
                        if (!square2Element.hasChildNodes()) {
                            // If all conditions are met, highlight the square two steps away and set the current attacked pawn and attacking square     
                            square2Element.classList.replace('dark', 'highlight');
                            // change the color of the highlighted square
                            highlightSquare(square2Element);
                            currAttackedPawns.push(square1Element.firstChild);
                            attackingSquares.push(square2Element);
                        }
                    }
                }
            } else {
                // If the square one step away is empty, highlight it
                square1Element.classList.replace('dark', 'highlight');
                // change the color of the highlighted square
                highlightSquare(square1Element);
            }
        }
    }
    
    function highlightRedKing(sqr) {
        tryHighlight(sqr, 'upLeft', 'upLeft', 'black');
        tryHighlight(sqr, 'upRight', 'upRight', 'black');
        tryHighlight(sqr, 'downLeft', 'downLeft', 'black');
        tryHighlight(sqr, 'downRight', 'downRight', 'black');
    }
    
    function highlightBlackKing(sqr) {
        tryHighlight(sqr, 'upLeft', 'upLeft', 'red');
        tryHighlight(sqr, 'upRight', 'upRight', 'red');
        tryHighlight(sqr, 'downLeft', 'downLeft', 'red');
        tryHighlight(sqr, 'downRight', 'downRight', 'red');
    }

    function highlightBlack(sqr) {
        tryHighlight(sqr, 'downLeft', 'downLeft', 'red');
        tryHighlight(sqr, 'downRight', 'downRight', 'red');
    }


    function highlightRed(sqr) {
        tryHighlight(sqr, 'upLeft', 'upLeft', 'black');
        tryHighlight(sqr, 'upRight', 'upRight', 'black');
    }

    function highlight(sqr){
        let currSquare = document.getElementById(sqr.id);
        let currPawn = currSquare.firstChild;
        // if the pawn is a red king
        if(currPawn.classList.contains('red') && currPawn.classList.contains('king')){
            highlightRedKing(sqr);
        }
        // if the pawn is a black king
        else if(currPawn.classList.contains('black') && currPawn.classList.contains('king')){
            highlightBlackKing(sqr);
        }
        else if(currPawn.classList.contains('black')){
            highlightBlack(sqr);
        }
        else if(currPawn.classList.contains('red')){
            highlightRed(sqr);
        }
    }

    function getSquare(currIndex, newIndex){
        let row = (currIndex[0] - 0);
        let col = (currIndex[2] - 0);
        if(newIndex == 'upRight'){
            let newX = row-1;
            let newY = col+1;
            let newId = (newX + ',' + newY);
            // if the new square is out of bounds, return -1
            if(newX < 0 || newY > columns-1){
                //console.log("out of bounds", newId);
                return -1;
            }
            return newId;
        }
        if(newIndex == 'upLeft'){
            let newX = row-1;
            let newY = col-1;
            let newId = (newX + ',' + newY);
            // if the new square is out of bounds, return -1
            if(newX < 0 || newY < 0){
                //console.log("out of bounds", newId);
                return -1;
            }
            return newId;
        }
        if(newIndex == 'downRight'){
            let newX = row+1;
            let newY = col+1;
            let newId = (newX + ',' + newY);
            // if the new square is out of bounds, return -1
            if(newX > rows-1 || newY > columns-1){
                //console.log("out of bounds", newId);
                return -1;
            }
            return newId;
        }
        if(newIndex == 'downLeft'){
            let newX = row+1;
            let newY = col-1;
            let newId = (newX + ',' + newY);
            // if the new square is out of bounds, return -1
            if(newX > rows - 1 || newY < 0){
                //console.log("out of bounds", newId);
                return -1;
            }
            return newId;
        }
    }

    function makePawns(rows, columns){
        boardContainer = document.getElementById('board');
        // make blacks
        for(let j = 0; j < 3; j++){
            for(let i = 0; i < columns; i++){
                if(i % 2 == 1 && j == 0){
                    currPawn = document.createElement('div');
                    currPawn.classList.add("black");
                    currPawn.classList.add("pawn");
                    currIndex =  j + ',' + i;
                    currHtmlSquare = document.getElementById(currIndex);
                    currHtmlSquare.appendChild(currPawn);
                }
                else if(i % 2 == 0 && j == 1){
                    currPawn = document.createElement('div');
                    currPawn.classList.add("black");
                    currPawn.classList.add("pawn");
                    currIndex =  j + ',' + i;
                    currHtmlSquare = document.getElementById(currIndex);
                    currHtmlSquare.appendChild(currPawn);
                    //console.log(currPawn);
                }
                else if(i % 2 == 1 && j == 2){
                    currPawn = document.createElement('div');
                    currPawn.classList.add("black");
                    currPawn.classList.add("pawn");
                    currIndex =  j + ',' + i;
                    currHtmlSquare = document.getElementById(currIndex);
                    currHtmlSquare.appendChild(currPawn);
                    //console.log(currPawn);
                }
            }
        }
        // make reds
        for(let j = rows-1; j >= rows - 3; j--){
            for(let i = 0; i < columns; i++){
                if(i % 2 == 0 && j == rows-1){
                    currPawn = document.createElement('div');
                    currPawn.classList.add("red");
                    currPawn.classList.add("pawn");
                    currIndex =  j + ',' + i;
                    currHtmlSquare = document.getElementById(currIndex);
                    currHtmlSquare.appendChild(currPawn);
                }
                else if(i % 2 == 1 && j == rows-2){
                    currPawn = document.createElement('div');
                    currPawn.classList.add("red");
                    currPawn.classList.add("pawn");
                    currIndex =  j + ',' + i;
                    currHtmlSquare = document.getElementById(currIndex);
                    currHtmlSquare.appendChild(currPawn);
                }
                else if(i % 2 == 0 && j == rows-3){
                    currPawn = document.createElement('div');
                    currPawn.classList.add("red");
                    currPawn.classList.add("pawn");
                    currIndex =  j + ',' + i;
                    currHtmlSquare = document.getElementById(currIndex);
                    currHtmlSquare.appendChild(currPawn);

                }
            }
        }
    }

    function createBoard(rows, columns){
        boardContainer = document.getElementById('board');
        // Create 64 divs, alternate between dark and light
        for(let j = 0; j < rows; j++){
            for(let i = 0; i < columns; i++){
                let square = document.createElement('div');
                square.classList.add('square');
                if(i % 2 == 0 && j % 2 == 0 || i % 2 == 1 && j % 2 == 1){
                    square.classList.add('light');
                } else {
                    square.classList.add('dark');
                }
                square.id = j + ',' + i;
                boardContainer.appendChild(square);
            }
        }
    }

    for(let j = 0; j < rows; j++){ // create 2d array board variable
        gameBoard[j] = [];
        for(let i = 0; i < columns; i++){
            currIndex =  j + ',' + i;
            currHtmlSquare = document.getElementById(currIndex);
            gameBoard[j][i] = new Square(currHtmlSquare, currIndex);
        }
    }

    // //console.log(blackHtmlPawns[0].parentNode)
    function createPawnArrays(){
        for(let i = 0; i < rows/2 * 3; i++){ // get all black pawns into array
            currPawn = blackHtmlPawns[i]
            blackPawns[i] = new Pawn(currPawn, "black", currPawn.parentNode.id, currPawn.parentNode.id);
        }
        //console.log(blackPawns);
        for(let i = 0; i < rows/2 * 3; i++){ // get all red pawns into array
            currPawn = redHtmlPawns[i]
            redPawns[i] = new Pawn(currPawn, "red", currPawn.parentNode.id, currPawn.parentNode.id);
        }
        //console.log(redPawns);
    }
    createPawnArrays();

    function makeBlackMove(){
        // if the game mode is single player or it isn't black's turn
        if(gameMode != 'pvc' || currTurn != 'black'){
            return;
        }
        console.log("makeBlackMove");
        // get all black pawns that can move
        console.log("blackmpawns:", blackPawns);
        let movableBlackPawns = []
        let capturingBlackPawns = []
        for(let i = 0; i < blackPawns.length; i++){
            currPawn = blackPawns[i].id;
            currSquare = currPawn.parentNode;
            console.log(currSquare);
            // if currSquare is not null
            if(currSquare != null){
                currSquareIndex = currSquare.id;
                console.log("currSquareIndex", currSquareIndex);
                if(canMoveToSquare(currSquareIndex, 'downLeft', 'red') || canMoveToSquare(currSquareIndex, 'downRight', 'red')){
                    movableBlackPawns.push(blackPawns[i]);
                    if(isCaptureMove(currSquareIndex, 'downLeft') || isCaptureMove(currSquareIndex, 'downRight')){
                        capturingBlackPawns.push(blackPawns[i]);
                    }
                }
                // if the pawn is a king
                if(blackPawns[i].isKing){
                    if(canMoveToSquare(currSquareIndex, 'upLeft', 'red') || canMoveToSquare(currSquareIndex, 'upRight', 'red')){
                        movableBlackPawns.push(blackPawns[i]);
                        if(isCaptureMove(currSquareIndex, 'upLeft') || isCaptureMove(currSquareIndex, 'upRight')){
                            capturingBlackPawns.push(blackPawns[i]);
                        }
                    }
                }
            }
        }
        console.log("movableBlackPawns", movableBlackPawns);
        // choose a random black pawn that can move
        let randPawn;
        if(capturingBlackPawns.length > 0){
            let randIndex = Math.floor(Math.random() * capturingBlackPawns.length);
            randPawn = capturingBlackPawns[randIndex];
        } else {
            let randIndex = Math.floor(Math.random() * movableBlackPawns.length);
            randPawn = movableBlackPawns[randIndex];
        }
        // get the square of the random pawn
        let randSquare = randPawn.id.parentNode;
        gPawn = randPawn.id;
        // highlight the squares that the pawn can move to
        showMoves(gPawn);
        // get all highlighted squares
        let highlightedSquares = document.getElementsByClassName("highlight");
        // choose a random highlighted square
        let randHighlightedSquareIndex = Math.floor(Math.random() * highlightedSquares.length);
        let randHighlightedSquare = highlightedSquares[randHighlightedSquareIndex];
        // move the pawn to the random highlighted square
        moveTo(randHighlightedSquare);
    }

    function isCaptureMove(currSquareIndex, direction){
        // Get the ID of the square one step away in the given direction
        let square1 = getSquare(currSquareIndex, direction);

        // Check if the square one step away is valid
        if (square1 != -1) {
            // Get the element of the square one step away
            let square1Element = document.getElementById(square1);

            // Check if the square one step away has a child node (i.e., a pawn)
            if (square1Element.hasChildNodes()) {
                // Check if the pawn in the square one step away is of the enemy color
                if (square1Element.firstChild.classList.contains('red')) {
                    // Get the ID of the square two steps away in the given direction
                    let square2 = getSquare(square1, direction);

                    // Check if the square two steps away is valid
                    if (square2 != -1) {
                        // Get the element of the square two steps away
                        let square2Element = document.getElementById(square2);

                        // Check if the square two steps away doesn't have a child node (i.e., is empty)
                        if (!square2Element.hasChildNodes()) {
                            // If all conditions are met, the pawn can attack
                            return true;
                        }
                    }
                }
            }
        }
        // If any of the conditions is not met, the pawn can't attack
        return false;
    }
}

