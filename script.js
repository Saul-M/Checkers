function createBoard(){
    boardContainer = document.getElementById('board');
    // Create 64 divs, alternate between dark and light
    for(let j = 0; j < 8; j++){
        for(let i = 0; i < 8; i++){
            let square = document.createElement('div');
            square.classList.add('square');
            let pawn = document.createElement('div');
            if(j < 3){
                pawn.classList.add('pawn');
                pawn.classList.add('red');
            }
            if(j > 4){
                pawn.classList.add('pawn');
                pawn.classList.add('black');
            }
            if(i % 2 == 0 && j % 2 == 0 || i % 2 == 1 && j % 2 == 1){
                square.classList.add('light');
            } else {
                square.classList.add('dark');
                square.appendChild(pawn);
                square.classList.toggle('occupied');
                pawn.addEventListener("mouseover", function(){
                    showMoves(pawn);
                });
                pawn.addEventListener("mouseout", function(){
                    hideMoves(pawn);
                });
            }
            square.id = j + ',' + i;
            boardContainer.appendChild(square);
        }
    }
}

createBoard();
function showMoves(pawn){
    let pawnPos = (pawn.parentElement.id);
    let pawnColor = pawn.className[5];
    // console.log(pawn.parentElement.classList);
    // console.log(pawnPos);
    // console.log(pawnColor); //(pawnPos[0]-0) + 1;
    if(pawnColor == 'r'){
        let newX = (pawnPos[0]-0) + 1;
        let newY1 = (pawnPos[2]-0) + 1;
        let newY2 = (pawnPos[2]-0) - 1;
        
        let pos1 = (newX + ',' + newY1);
        let move1 = document.getElementById(pos1);
        let pos2 = (newX + ',' + newY2);
        let move2 = document.getElementById(pos2);
        move1.style.backgroundColor = '#6c2525';
        move2.style.backgroundColor = '#6c2525';
    }
    else if(pawnColor =='b'){

    }
    
}
function hideMoves(pawn){
    let pawnPos = (pawn.parentElement.id);
    let pawnColor = pawn.className[5];
    // console.log(pawn.parentElement.classList);
    // console.log(pawnPos);
    // console.log(pawnColor);
    if(pawnColor == 'r'){
        let newX = (pawnPos[0]-0) + 1;
        let newY1 = (pawnPos[2]-0) + 1;
        let newY2 = (pawnPos[2]-0) - 1;
        
        let pos1 = (newX + ',' + newY1);
        let move1 = document.getElementById(pos1);
        let pos2 = (newX + ',' + newY2);
        let move2 = document.getElementById(pos2);
        move1.style.backgroundColor = '#4a0303';
        move2.style.backgroundColor = '#4a0303';
    }
    else if(pawnColor =='b'){

    }
    
}

class player{
    constructor(color){
        this.color = color;
    }
    getAvailablePieces(){

    }
    findMoves(){
        moveFound = false;


    }


}