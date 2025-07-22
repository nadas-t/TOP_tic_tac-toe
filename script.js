
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
  let value = "";
  
  // Accept a player's token to change the value of the cell
  const addToken = (token) => {
    value = token;
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


const gameController=(function (player1,player2){ 
  console.log("Bem vindos ao jogo!")
  
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

  const resetRound=()=>{
    round=0
  }
  
  const printNewRound = ()=>{
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`)
  };//nao vai precisar mais
  let fimDeJogo=false;
  
  const playRound = (row,column)=>{

    
      let validTurn=board.dropToken(row,column,getActivePlayer())
      if(validTurn){
        if(gameLogic.checkVictory(board,row,column,getActivePlayer().token)){
          fimDeJogo=true
          return {
            message:`O jogador ${getActivePlayer().name} é o vencedor.Fim de jogo!\nObrigado por jogar!`}
          }
          else if(gameLogic.checkEndOfGame(round)){
          fimDeJogo=true
          return {
            message:`Empate!\nObrigado por jogar!`
          }
        }
        else{
          increaseRound();
          switchPlayerTurn();
          return {
            message:null
          }
        }
      }
      else{
        return {
            message:`Jogada inválida tente novamente!`
          }
      }
  };

  const isFimDeJogo=()=>{
    return fimDeJogo
  }

  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard,
    getRound,
    resetRound,
    isFimDeJogo
  };
      
});

const screenController=(()=>{
  const form=document.getElementById('players-name');
  const playerTurnDiv=document.querySelector('.player-turn')
  const roundCounterDiv=document.querySelector('.round-counter')
  const gameText=document.querySelector('.game-text')
  const boardDiv=document.querySelector('.gameboard')
  const resetBut=document.getElementById('reset-board')

  const resetarBoard=(game)=>{
    boardDiv.textContent="";
    board.forEach((row,rowIndex) =>{ 
        row.forEach((cell,cellIndex)=>{
          const cellButton = document.createElement("button")
          cellButton.classList.add("cell");
          cellButton.dataset.row=rowIndex
          cellButton.dataset.column=cellIndex
          cellButton.textContent=cell.getValue();
          boardDiv.appendChild(cellButton);
        })
      })
  }

  const updateScreen=(game,message,resetar)=>{
      boardDiv.textContent="";
  
      const board=game.getBoard();
      const activePlayer= game.getActivePlayer();
      
      if(!resetar){
        if(game.isFimDeJogo()){
          playerTurnDiv.textContent=``
          roundCounterDiv.textContent=``
          gameText.textContent=message
        }
        else{
          playerTurnDiv.textContent=`Vez de ${activePlayer.name}!`
          roundCounterDiv.textContent=`Round ${game.getRound()}`

          const frases = [
            "A persistência realiza o impossível.",
            "Acredite no seu potencial.",
            "Cada passo conta, continue!",
            "Você é mais forte do que pensa.",
            "Tudo começa com uma atitude.",
            "Erros são parte do caminho.",
            "O sucesso é a soma de pequenos esforços.",
            "Nunca é tarde para recomeçar.",
          ];

          // Pega uma frase aleatória
          const fraseAleatoria = frases[Math.floor(Math.random() * frases.length)];

          gameText.textContent=fraseAleatoria;

        }
      }
      else{
        playerTurnDiv.textContent=`Bem vindo ao jogo!`
        roundCounterDiv.textContent=``
        gameText.textContent="Pressione iniciar para começar"

        // resetar round
      } 
      board.forEach((row,rowIndex) =>{ 
        row.forEach((cell,cellIndex)=>{
          const cellButton = document.createElement("button")
          cellButton.classList.add("cell");
          cellButton.dataset.row=rowIndex
          cellButton.dataset.column=cellIndex
          cellButton.textContent=cell.getValue();
          boardDiv.appendChild(cellButton);
        })
      })
    }
  
  form.addEventListener('submit',(e)=>{
    e.preventDefault();
    
    const player1Name=document.getElementById('player1').value.trim();
    const player2Name=document.getElementById('player2').value.trim();
    //pegar simbolos dps
    
    const player1=createPlayer(player1Name,"O")
    const player2=createPlayer(player2Name,"X")
  
    const game = gameController(player1,player2);

    // reset
    updateScreen(game,"");

    boardDiv.addEventListener("click",(e)=>{
      if(!game.isFimDeJogo()){
        if (e.target.classList.contains("cell")) {
          const selectedColumn = parseInt(e.target.dataset.column);
          const selectedRow = parseInt(e.target.dataset.row);
          const mensagem = game.playRound(selectedRow, selectedColumn);
          updateScreen(game, mensagem.message,false);
        }
      }
    })

    resetBut.addEventListener('click',(e)=>{
      game.getBoard().forEach(row => {
        row.forEach(cell => {
          cell.addToken(""); // ou null, ou " " dependendo do seu jogo
        });
      });
      game.resetRound();
      updateScreen(game,"",true);
  
    })
  })


})();

    







