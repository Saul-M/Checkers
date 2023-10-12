function createBoard(){
    boardContainer = document.getElementById('board');
    // Create 64 divs, alternate between black and white
    for(let j = 0; j < 8; j++){
        for(let i = 0; i < 8; i++){
            let square = document.createElement('div');
            square.classList.add('square');
            if(i % 2 == 0 && j % 2 == 0 || i % 2 == 1 && j % 2 == 1){
                square.classList.add('black');
            } else {
                square.classList.add('white');
            }
            boardContainer.appendChild(square);
        }
    }
}
createBoard();