
// ----------------------------------------------------------------------- 

const Gameboard = (function(){
    const rows=3
    const columns=3
    const board=[]


    for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(createCell());
    }
    }

    const getBoard=()=>board;

    const printBoard = () => {
      const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
      boardWithCellValues.forEach((row)=>console.log(row))
      // console.log(boardWithCellValues); //for i in board print row
    };

    const dropToken = (row,column, player) => {
      if(board[row][column].getValue()==0){
        board[row][column].addToken(player.token) 
        return true
      }
      else{
        console.log("Não é possível colocar seu token aqui, tente novamente\n")
        return false
      }
    };

    //reset?

  return { getBoard, dropToken, printBoard };
});

// ----------------------------------------------------------------------- 

function createCell() {
  let value = 0;
  
  // Accept a player's token to change the value of the cell
  const addToken = (player) => {
    value = player;
  };

  // How we will retrieve the current value of this cell through closure
  const getValue = () => value;
  
  return {
    addToken,
    getValue
  };
};

// -----------------------------------------------------------------------

function createPlayer(name,token){
  return {name,token};
}

// -----------------------------------------------------------------------
const gameLogic = (function(){
  const checkEndOfGame = (round) => round === 8;
  
  const checkVictory = (board, row, column, activePlayer)=>{

    const checkVert=()=>{
      for(let i=0;i<3;i++){
        if(board.getBoard()[i][column].getValue()!==activePlayer){
          return false
        }
      }
      return true
    }
    const checkHoriz=()=>{
      for(let i=0;i<3;i++){
        if(board.getBoard()[row][i].getValue()!==activePlayer){
          return false
        }
      }
      return true;
    }
    const checkDiagPrim=()=>{
      for(let i=0;i<3;i++){
        if (board.getBoard()[i][i].getValue() !==activePlayer){
          return false
        }
      }
      return true
    }
    const checkDiagSec = () => {
      for (let i = 0; i < 3; i++) {
        if (board.getBoard()[i][2 - i].getValue() !== activePlayer) {
          return false;
        }
      }
      return true;
    };

    return checkVert() || checkHoriz() || checkDiagPrim() || checkDiagSec();
  }
  return {checkVictory,checkEndOfGame}
  })();


// -----------------------------------------------------------------------


const gameController=(function (){ //preciso usar só uma vez?
  console.log("Bem vindos ao jogo!")

  const player1=createPlayer("Rosineide","O");
  const player2=createPlayer("Thiagao","X");
  
  const board=Gameboard();

  let round=0
  let activePlayer=player1;
  
  const increaseRound=()=>{
    round++
  }

  const switchPlayerTurn = ()=>{
    activePlayer=activePlayer===player1? player2 : player1;
  }
      
  const getActivePlayer=()=> activePlayer;
  const getRound=()=>round;
  
  const printNewRound = ()=>{
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`)
  };
  
  const playRound = (row,column)=>{

    console.log(`Putting ${getActivePlayer().name}'s mark into row ${row+1} and column ${column+1}\n`)
    let validTurn=board.dropToken(row,column,getActivePlayer())
    
    if(validTurn){
      if(gameLogic.checkVictory(board,row,column,getActivePlayer().token)){
        console.log(`O jogador ${getActivePlayer().name} é o vencedor.\nFim de jogo!Obrigado por jogar!`)
        return false
      }
      else if(gameLogic.checkEndOfGame(round)){
        console.log(`Não há vencedores: Empate,fim de jogo!Obrigado por jogar!`)
        return false
      }
      else{
        increaseRound();
        switchPlayerTurn();
        printNewRound();
        return true
      }
    }
    else{
      //jogada foi invalida vai ter que refazer
      printNewRound();
      return true
    }
  };

  const readline = require("readline");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const askMove = () => {
    rl.question(`\n${getActivePlayer().name}, digite a linha (1-3): `, (rowStr) => {
      rl.question(`Digite a coluna (1-3): `, (colStr) => {
        let row = parseInt(rowStr);
        let col = parseInt(colStr);
        row--;
        col--;

        if (isNaN(row) || isNaN(col) || row < 0 || row > 2 || col < 0 || col > 2) {
          console.log("Entrada inválida. Tente novamente.");
          askMove();
          return;
        }

        // console.log() //so pra pular linha

        const continueGame = playRound(row, col);

        if (continueGame) {
          // Continua pedindo jogadas
          askMove();
        } else {
          // Fim do jogo
          rl.close();
          // console.log("Fim do jogo. Obrigado por jogar!");
        }
      });
    });
  };

  // Start the game loop
  printNewRound();
  askMove();

  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard,
    getRound
  };
      
});

const screenController=()=>{
  const game = GameController();
}

    







