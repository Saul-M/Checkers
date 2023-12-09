var rows = 8;
var columns = 8;
var makingMove = false;
createBoard(rows, columns);
makePawns(rows, columns);
var allSquares = document.getElementsByClassName("square");
//console.log(allSquares);
var gameBoard = [] 
var blackPawns = []
var blackHtmlPawns = document.getElementsByClassName("black");
//console.log(blackHtmlPawns);
var redPawns = []
var redHtmlPawns = document.getElementsByClassName("red");
//console.log(redHtmlPawns);
// global variables to keep track of game logic
var currTurn = "red";
var gPawn;
var currAttackedPawn = -1;
var attackingSquare = -1;
var highlighted = false;
// make the board the right size with css
let board = document.getElementById('board');
board.style.gridTemplateColumns = `repeat(${columns}, 50px)`;
board.style.gridTemplateRows = `repeat(${rows}, 50px)`;

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

    // log every variable used in the function
    // //console.log("makingMove: " + makingMove);
    // //console.log("currAttackedPawn: " + currAttackedPawn);
    // //console.log("attackingSquare: " + attackingSquare);
    // //console.log("currTurn: " + currTurn);
    // //console.log("gPawn: " + gPawn);
    // //console.log("clickedSquare: " + clickedSquare);
    // //console.log("currAttackedPawn: " + currAttackedPawn);
    // //console.log("attackingSquare: " + attackingSquare);
    // //console.log("~~~~~~~~~~~~~~~~~~~");

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
        if(currAttackedPawn != -1 && clickedSquare == attackingSquare){
            // remove the pawn from the array
            if(currAttackedPawn.classList.contains('black')){
                console.log("removing black pawn");
                for(let i = 0; i < blackPawns.length; i++){
                    console.log("current id:", blackPawns[i].id);
                    if(blackPawns[i].id == currAttackedPawn){
                        blackPawns.splice(i, 1);
                        console.log(blackPawns);
                    }
                }
            }
            else if(currAttackedPawn.classList.contains('red')){
                for(let i = 0; i < redPawns.length; i++){
                    if(redPawns[i].id == currAttackedPawn.id){
                        redPawns.splice(i, 1);
                        console.log(redPawns);
                    }
                }
            }
            // remove the pawn from the board
            currAttackedPawn.parentNode.removeChild(currAttackedPawn);
            currAttackedPawn = -1;
            makingMove = true;
            takeAgain();
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
        
        unhighlight();
        toggleTurn();
        checkGameOver();
    }
}

function highlightRedKingAttacks(currSquare){
    // get all potential squares that could be highlighted
    let upLeft = getSquare(currSquare.id, 'upLeft');
    let upRight = getSquare(currSquare.id, 'upRight');
    let downLeft = getSquare(currSquare.id, 'downLeft');
    let downRight = getSquare(currSquare.id, 'downRight');
    let upLeftAtk = getSquare(upLeft, 'upLeft');
    let upRightAtk = getSquare(upRight, 'upRight');
    let downLeftAtk = getSquare(downLeft, 'downLeft');
    let downRightAtk = getSquare(downRight, 'downRight');
    // if upLeft is valid
    if(upLeft != -1){
        // if upLeft has a pawn in it
        if(document.getElementById(upLeft).hasChildNodes()){
            // if the pawn in upLeft is black (enemy)
            if(document.getElementById(upLeft).firstChild.classList.contains('black')){
                // if upLeftAtk is a valid square
                if(upLeftAtk != -1){
                    // if upLeftAtk is empty
                    if(document.getElementById(upLeftAtk).hasChildNodes() == false){
                        // highlight upLeftAtk
                        document.getElementById(upLeftAtk).classList.replace('dark', 'highlight');
                        currAttackedPawn = document.getElementById(upLeft).firstChild;
                        attackingSquare = document.getElementById(upLeftAtk);
                        console.log("attackingSquare:", attackingSquare);
                    }
                }
            }
        }
    }
    // if upRight is valid
    if(upRight != -1){
        // if upRight has a pawn in it
        if(document.getElementById(upRight).hasChildNodes()){
            // if the pawn in upRight is black
            if(document.getElementById(upRight).firstChild.classList.contains('black')){
                // if upRightAtk is a valid square
                if(upRightAtk != -1){
                    // if upRightAtk is empty
                    if(document.getElementById(upRightAtk).hasChildNodes() == false){
                        // highlight upRightAtk
                        document.getElementById(upRightAtk).classList.replace('dark', 'highlight');
                        currAttackedPawn = document.getElementById(upRight).firstChild;
                        attackingSquare = document.getElementById(upRightAtk);
                        console.log("attackingSquare:", attackingSquare);
                    }
                }
            }
        }
    }
    // if downLeft is valid
    if(downLeft != -1){
        // if downLeft has a pawn in it
        if(document.getElementById(downLeft).hasChildNodes()){
            // if the pawn in downLeft is black
            if(document.getElementById(downLeft).firstChild.classList.contains('black')){
                // if downLeftAtk is a valid square
                if(downLeftAtk != -1){
                    // if downLeftAtk is empty
                    if(document.getElementById(downLeftAtk).hasChildNodes() == false){
                        // highlight downLeftAtk
                        document.getElementById(downLeftAtk).classList.replace('dark', 'highlight');
                        currAttackedPawn = document.getElementById(downLeft).firstChild;
                        attackingSquare = document.getElementById(downLeftAtk);
                        console.log("attackingSquare:", attackingSquare);
                    }
                }
            }
        }
    }
    // if downRight is valid
    if(downRight != -1){
        // if downRight has a pawn in it
        if(document.getElementById(downRight).hasChildNodes()){
            // if the pawn in downRight is black
            if(document.getElementById(downRight).firstChild.classList.contains('black')){
                // if downRightAtk is a valid square
                if(downRightAtk != -1){
                    // if downRightAtk is empty
                    if(document.getElementById(downRightAtk).hasChildNodes() == false){
                        // highlight downRightAtk
                        document.getElementById(downRightAtk).classList.replace('dark', 'highlight');
                        currAttackedPawn = document.getElementById(downRight).firstChild;
                        attackingSquare = document.getElementById(downRightAtk);
                        console.log("attackingSquare:", attackingSquare);
                    }
                }
            }
        }
    }
}

function takeAgain(){
    console.log("takeAgain");
    //if the pawn is a red king
    if(gPawn.classList.contains('red') && gPawn.classList.contains('king')){
        console.log("red king");
        let currSquare = gPawn.parentNode;
        highlightRedKingAttacks(currSquare);
        
    }

    //if the pawn is a black king

    //if the pawn is a black pawn

    //if the pawn is a red pawn
}
function showMoves(pawn){
    unhighlight();
    //console.log("showing moves for pawn:", pawn);
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
    else if(!redPawns.some(canMoveRed)){
        console.log("no moves for red");
        alert("Black wins! There are no more moves for red");
    }
    // if there are no more moves for black, red wins
    else if(!blackPawns.some(canMoveBlack)){
        console.log("no moves for black");
        alert("Red wins! There are no more moves for black");
    }
}
function canMoveRed(pawn){
    //console.log(pawn);
    pawnId = pawn.square;
    // get all potential squares that could be highlighted
    let upLeft = getSquare(pawnId, 'upLeft');
    let upRight = getSquare(pawnId, 'upRight');
    let upLeftAtk = getSquare(upLeft, 'upLeft');
    let upRightAtk = getSquare(upRight, 'upRight');
    // if upLeft is valid
    if(upLeft != -1){
        // if upLeft is empty
        if(document.getElementById(upLeft).hasChildNodes() == false){
            return true;
        }
        // if upLeft has a pawn in it
        else{
            // if the pawn in upLeft is black
            if(document.getElementById(upLeft).firstChild.classList.contains('black')){
                // if upLeftAtk is a valid square
                if(upLeftAtk != -1){
                    // if upLeftAtk is empty
                    if(document.getElementById(upLeftAtk).hasChildNodes() == false){
                        return true;
                    }
                }
            }
        }
    }
    // if upRight is valid
    if(upRight != -1){
        // if upRight is empty
        if(document.getElementById(upRight).hasChildNodes() == false){
            return true;
        }
        // if upRight has a pawn in it
        else{
            // if the pawn in upRight is black
            if(document.getElementById(upRight).firstChild.classList.contains('black')){
                // if upRightAtk is a valid square
                if(upRightAtk != -1){
                    // if upRightAtk is empty
                    if(document.getElementById(upRightAtk).hasChildNodes() == false){
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

function canMoveBlack(pawn){
    pawnId = pawn.square;
    //console.log(pawnId);
    // get all potential squares that could be highlighted
    let downLeft = getSquare(pawnId, 'downLeft');
    let downRight = getSquare(pawnId, 'downRight');
    let downLeftAtk = getSquare(downLeft, 'downLeft');
    let downRightAtk = getSquare(downRight, 'downRight');
    // if downLeft is valid
    if(downLeft != -1){
        // if downLeft is empty
        if(document.getElementById(downLeft).hasChildNodes() == false){
            return true;
        }
        // if downLeft has a pawn in it
        else{
            // if the pawn in downLeft is red
            if(document.getElementById(downLeft).firstChild.classList.contains('red')){
                // if downLeftAtk is a valid square
                if(downLeftAtk != -1){
                    // if downLeftAtk is empty
                    if(document.getElementById(downLeftAtk).hasChildNodes() == false){
                        return true;
                    }
                }
            }
        }
    }
    // if downRight is valid
    if(downRight != -1){
        // if downRight is empty
        if(document.getElementById(downRight).hasChildNodes() == false){
            return true;
        }
        // if downRight has a pawn in it
        else{
            // if the pawn in downRight is red
            if(document.getElementById(downRight).firstChild.classList.contains('red')){
                // if downRightAtk is a valid square
                if(downRightAtk != -1){
                    // if downRightAtk is empty
                    if(document.getElementById(downRightAtk).hasChildNodes() == false){
                        return true;
                    }
                }
            }
        }
    }
    return false;
}
function toggleTurn(){
    if(currTurn == 'black'){
        currTurn = 'red';
    }
    else{
        currTurn = 'black';
    }
    //console.log("current turn:",currTurn);
    let turnDisplay = document.getElementById('turnDisplay');
    turnDisplay.innerHTML = currTurn;
}

 
function highlightRedKing(sqr) {
    // get all potential squares that could be highlighted
    let upLeft = getSquare(sqr.id, 'upLeft');
    let upRight = getSquare(sqr.id, 'upRight');
    let downLeft = getSquare(sqr.id, 'downLeft');
    let downRight = getSquare(sqr.id, 'downRight');
    let upLeftAtk = getSquare(upLeft, 'upLeft');
    let upRightAtk = getSquare(upRight, 'upRight');
    let downLeftAtk = getSquare(downLeft, 'downLeft');
    let downRightAtk = getSquare(downRight, 'downRight');
    // if upLeft is valid
    if(upLeft != -1){
        // if upLeft has a pawn in it
        if(document.getElementById(upLeft).hasChildNodes()){
            // if the pawn in upLeft is black (enemy)
            if(document.getElementById(upLeft).firstChild.classList.contains('black')){
                // if upLeftAtk is a valid square
                if(upLeftAtk != -1){
                    // if upLeftAtk is empty
                    if(document.getElementById(upLeftAtk).hasChildNodes() == false){
                        // highlight upLeftAtk
                        document.getElementById(upLeftAtk).classList.replace('dark', 'highlight');
                        currAttackedPawn = document.getElementById(upLeft).firstChild;
                        attackingSquare = document.getElementById(upLeftAtk);
                    }
                }
            }
        }
        else{ // else highlight upLeft
            document.getElementById(upLeft).classList.replace('dark', 'highlight');
        }
    }
    // if upRight is valid
    if(upRight != -1){
        // if upRight has a pawn in it
        if(document.getElementById(upRight).hasChildNodes()){
            // if the pawn in upRight is black
            if(document.getElementById(upRight).firstChild.classList.contains('black')){
                // if upRightAtk is a valid square
                if(upRightAtk != -1){
                    // if upRightAtk is empty
                    if(document.getElementById(upRightAtk).hasChildNodes() == false){
                        // highlight upRightAtk
                        document.getElementById(upRightAtk).classList.replace('dark', 'highlight');
                        currAttackedPawn = document.getElementById(upRight).firstChild;
                        attackingSquare = document.getElementById(upRightAtk);
                    }
                }
            }
        }
        else{ // else highlight upRight
            document.getElementById(upRight).classList.replace('dark', 'highlight');
        }
    }

    if(downLeft != -1){
        // if downLeft has a pawn in it
        if(document.getElementById(downLeft).hasChildNodes()){
            // if the pawn in downLeft is black
            if(document.getElementById(downLeft).firstChild.classList.contains('black')){
                // if downLeftAtk is a valid square
                if(downLeftAtk != -1){
                    // if downLeftAtk is empty
                    if(document.getElementById(downLeftAtk).hasChildNodes() == false){
                        // highlight downLeftAtk
                        document.getElementById(downLeftAtk).classList.replace('dark', 'highlight');
                        currAttackedPawn = document.getElementById(downLeft).firstChild;
                        attackingSquare = document.getElementById(downLeftAtk);
                    }
                }
            }
        }
        else{ // else highlight downLeft
            document.getElementById(downLeft).classList.replace('dark', 'highlight');
        }
    }
    // if downRight downRight is valid
    if(downRight != -1){
        // if downRight has a pawn in it
        if(document.getElementById(downRight).hasChildNodes()){
            // if the pawn in downRight is black
            if(document.getElementById(downRight).firstChild.classList.contains('black')){
                // if downRightAtk is a valid square
                if(downRightAtk != -1){
                    // if downRightAtk is empty
                    if(document.getElementById(downRightAtk).hasChildNodes() == false){
                        // highlight downRightAtk
                        document.getElementById(downRightAtk).classList.replace('dark', 'highlight');
                        currAttackedPawn = document.getElementById(downRight).firstChild;
                        attackingSquare = document.getElementById(downRightAtk);
                    }
                }
            }
        }
        else{ // else highlight downRight
            document.getElementById(downRight).classList.replace('dark', 'highlight');
        }
    }

} 
function highlightBlackKing(sqr) {
    // get all potential squares that could be highlighted
    let upLeft = getSquare(sqr.id, 'upLeft');
    let upRight = getSquare(sqr.id, 'upRight');
    let downLeft = getSquare(sqr.id, 'downLeft');
    let downRight = getSquare(sqr.id, 'downRight');
    let upLeftAtk = getSquare(upLeft, 'upLeft');
    let upRightAtk = getSquare(upRight, 'upRight');
    let downLeftAtk = getSquare(downLeft, 'downLeft');
    let downRightAtk = getSquare(downRight, 'downRight');
    // if upLeft is valid
    if(upLeft != -1){
        // if upLeft has a pawn in it
        if(document.getElementById(upLeft).hasChildNodes()){
            // if the pawn in upLeft is red (enemy)
            if(document.getElementById(upLeft).firstChild.classList.contains('red')){
                // if upLeftAtk is a valid square
                if(upLeftAtk != -1){
                    // if upLeftAtk is empty
                    if(document.getElementById(upLeftAtk).hasChildNodes() == false){
                        // highlight upLeftAtk
                        document.getElementById(upLeftAtk).classList.replace('dark', 'highlight');
                        currAttackedPawn = document.getElementById(upLeft).firstChild;
                        attackingSquare = document.getElementById(upLeftAtk);
                    }
                }
            }
        }
        else{ // else highlight upLeft
            document.getElementById(upLeft).classList.replace('dark', 'highlight');
        }
    }
    // if upRight is valid
    if(upRight != -1){
        // if upRight has a pawn in it
        if(document.getElementById(upRight).hasChildNodes()){
            // if the pawn in upRight is red
            if(document.getElementById(upRight).firstChild.classList.contains('red')){
                // if upRightAtk is a valid square
                if(upRightAtk != -1){
                    // if upRightAtk is empty
                    if(document.getElementById(upRightAtk).hasChildNodes() == false){
                        // highlight upRightAtk
                        document.getElementById(upRightAtk).classList.replace('dark', 'highlight');
                        currAttackedPawn = document.getElementById(upRight).firstChild;
                        attackingSquare = document.getElementById(upRightAtk);
                    }
                }
            }
        }
        else{ // else highlight upRight
            document.getElementById(upRight).classList.replace('dark', 'highlight');
        }
    }

    if(downLeft != -1){
        // if downLeft has a pawn in it
        if(document.getElementById(downLeft).hasChildNodes()){
            // if the pawn in downLeft is red
            if(document.getElementById(downLeft).firstChild.classList.contains('red')){
                // if downLeftAtk is a valid square
                if(downLeftAtk != -1){
                    // if downLeftAtk is empty
                    if(document.getElementById(downLeftAtk).hasChildNodes() == false){
                        // highlight downLeftAtk
                        document.getElementById(downLeftAtk).classList.replace('dark', 'highlight');
                        currAttackedPawn = document.getElementById(downLeft).firstChild;
                        attackingSquare = document.getElementById(downLeftAtk);
                    }
                }
            }
        }
        else{ // else highlight downLeft
            document.getElementById(downLeft).classList.replace('dark', 'highlight');
        }
    }
    // if downRight downRight is valid
    if(downRight != -1){
        // if downRight has a pawn in it
        if(document.getElementById(downRight).hasChildNodes()){
            // if the pawn in downRight is red
            if(document.getElementById(downRight).firstChild.classList.contains('red')){
                // if downRightAtk is a valid square
                if(downRightAtk != -1){
                    // if downRightAtk is empty
                    if(document.getElementById(downRightAtk).hasChildNodes() == false){
                        // highlight downRightAtk
                        document.getElementById(downRightAtk).classList.replace('dark', 'highlight');
                        currAttackedPawn = document.getElementById(downRight).firstChild;
                        attackingSquare = document.getElementById(downRightAtk);
                    }
                }
            }
        }
        else{ // else highlight downRight
            document.getElementById(downRight).classList.replace('dark', 'highlight');
        }
    }
} 


function highlightBlack(sqr) {
    // get all potential squares that could be highlighted
    let downLeft = getSquare(sqr.id, 'downLeft');
    let downRight = getSquare(sqr.id, 'downRight');
    let downLeftAtk = getSquare(downLeft, 'downLeft');
    let downRightAtk = getSquare(downRight, 'downRight');   
    // if downLeft downLeft is valid
    if(downLeft != -1){
        // if downLeft has a pawn in it
        if(document.getElementById(downLeft).hasChildNodes()){
            // if the pawn in downLeft is red
            if(document.getElementById(downLeft).firstChild.classList.contains('red')){
                // if downLeftAtk is a valid square
                if(downLeftAtk != -1){
                    // if downLeftAtk is empty
                    if(document.getElementById(downLeftAtk).hasChildNodes() == false){
                        // highlight downLeftAtk
                        document.getElementById(downLeftAtk).classList.replace('dark', 'highlight');
                        currAttackedPawn = document.getElementById(downLeft).firstChild;
                        attackingSquare = document.getElementById(downLeftAtk);
                    }
                }
            }
        }
        else{ // else highlight downLeft
            document.getElementById(downLeft).classList.replace('dark', 'highlight');
        }
    }
    // if downRight downRight is valid
    if(downRight != -1){
        // if downRight has a pawn in it
        if(document.getElementById(downRight).hasChildNodes()){
            // if the pawn in downRight is red
            if(document.getElementById(downRight).firstChild.classList.contains('red')){
                // if downRightAtk is a valid square
                if(downRightAtk != -1){
                    // if downRightAtk is empty
                    if(document.getElementById(downRightAtk).hasChildNodes() == false){
                        // highlight downRightAtk
                        document.getElementById(downRightAtk).classList.replace('dark', 'highlight');
                        currAttackedPawn = document.getElementById(downRight).firstChild;
                        attackingSquare = document.getElementById(downRightAtk);
                    }
                }
            }
        }
        else{ // else highlight downRight
            document.getElementById(downRight).classList.replace('dark', 'highlight');
        }
    }

}

function highlightRed(sqr) {
    // get all potential squares that could be highlighted
    let upLeft = getSquare(sqr.id, 'upLeft');
    let upRight = getSquare(sqr.id, 'upRight');
    let upLeftAtk = getSquare(upLeft, 'upLeft');
    let upRightAtk = getSquare(upRight, 'upRight');   
    // if upLeft upLeft is valid
    if(upLeft != -1){
        // if upLeft has a pawn in it
        if(document.getElementById(upLeft).hasChildNodes()){
            // if the pawn in upLeft is black
            if(document.getElementById(upLeft).firstChild.classList.contains('black')){
                // if upLeftAtk is a valid square
                if(upLeftAtk != -1){
                    // if upLeftAtk is empty
                    if(document.getElementById(upLeftAtk).hasChildNodes() == false){
                        // highlight upLeftAtk
                        document.getElementById(upLeftAtk).classList.replace('dark', 'highlight');
                        currAttackedPawn = document.getElementById(upLeft).firstChild;
                        attackingSquare = document.getElementById(upLeftAtk);
                    }
                }
            }
        }
        else{ // else highlight upLeft
            document.getElementById(upLeft).classList.replace('dark', 'highlight');
        }
    }
    // if upRight is valid
    if(upRight != -1){
        // if upRight has a pawn in it
        if(document.getElementById(upRight).hasChildNodes()){
            // if the pawn in upRight is black
            if(document.getElementById(upRight).firstChild.classList.contains('black')){
                // if upRightAtk is a valid square
                if(upRightAtk != -1){
                    // if upRightAtk is empty
                    if(document.getElementById(upRightAtk).hasChildNodes() == false){
                        // highlight upRightAtk
                        document.getElementById(upRightAtk).classList.replace('dark', 'highlight');
                        currAttackedPawn = document.getElementById(upRight).firstChild;
                        attackingSquare = document.getElementById(upRightAtk);
                    }
                }
            }
        }
        else{ // else highlight upRight
            document.getElementById(upRight).classList.replace('dark', 'highlight');
        }
    }
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