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
                pawn.style.backgroundColor = "#222";
            }
            if(j > 4){
                pawn.classList.add('pawn');
                pawn.style.backgroundColor = "#d00";
            }
            if(i % 2 == 0 && j % 2 == 0 || i % 2 == 1 && j % 2 == 1){
                square.classList.add('light');
            } else {
                square.classList.add('dark');
                square.appendChild(pawn);
                pawn.addEventListener("click", function(){
                    showMoves(pawn);
                });
            }
            boardContainer.appendChild(square);
        }
    }
}

createBoard();
function showMoves(pawn){

}

class square{
    constructor(color){
        this.color = color;
        this.hasPawn = false;
    }
}
class pawn{
    constructor(color){
        this.color = color;
        this.isKing = false;
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