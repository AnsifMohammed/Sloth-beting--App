
const SYMBOLS_COUNT = {
    A: 3,
    B: 4,
    C: 6,
    D: 8,
  };
  
  const SYMBOLS_VALUES = {
    A: 5,
    B: 4,
    C: 3,
    D: 2,
  };
  
  let balance = 0;
  let numberOfLines = 0;
  let betPerLine = 0;
  
  const startButton = document.getElementById("start-button");
  const spinButton = document.getElementById("spin-button");
  const playAgainButton = document.getElementById("play-again-button");
  const depositInput = document.getElementById("deposit");
  const linesInput = document.getElementById("lines");
  const betInput = document.getElementById("bet");
  const reelsDisplay = document.getElementById("reels");
  const gameResult = document.getElementById("game-result");
  const balanceDisplay = document.getElementById("balance");
  
  startButton.addEventListener("click", () => {
    const depositAmount = parseFloat(depositInput.value);
    if (isNaN(depositAmount) || depositAmount <= 0) {
      alert("Invalid deposit amount");
      return;
    }
    balance = depositAmount;
    balanceDisplay.textContent = `Balance: $${balance.toFixed(2)}`;
    document.getElementById("deposit-section").style.display = "none";
    document.getElementById("game-play-section").style.display = "block";
  });
  
  spinButton.addEventListener("click", () => {
    numberOfLines = parseInt(linesInput.value);
    betPerLine = parseFloat(betInput.value);
  
    if (isNaN(numberOfLines) || numberOfLines < 1 || numberOfLines > 3 || isNaN(betPerLine) || betPerLine <= 0 || betPerLine > balance) {
      alert("Invalid bet or number of lines");
      return;
    }
  
    balance -= betPerLine * numberOfLines;
    balanceDisplay.textContent = `Balance:  ₹:${balance.toFixed(2)}`;
  
    const reels = spinReels();
    const rows = transposeReels(reels);
    displayReels(rows);
  
    const winnings = calculateWinnings(rows, betPerLine, numberOfLines);
    gameResult.textContent = winnings > 0 ? `You won  ₹:${winnings.toFixed(2)}` : "No winnings this round";
    gameResult.style.display = "block";
  
    if (balance <= 0) {
      alert("You ran out of money!");
      spinButton.style.display = "none";
    }
  
    playAgainButton.style.display = "block";
  });
  
  playAgainButton.addEventListener("click", () => {
    document.getElementById("game-play-section").style.display = "none";
    document.getElementById("deposit-section").style.display = "block";
    gameResult.style.display = "none";
    spinButton.style.display = "block";
    depositInput.value = "";
    linesInput.value = "";
    betInput.value = "";
    balanceDisplay.textContent = `Balance: $0`;
  });
  
  const spinReels = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
      for (let i = 0; i < count; i++) {
        symbols.push(symbol);
      }
    }
  
    const reels = [];
    for (let i = 0; i < 3; i++) {
      reels.push([])
      const reelSymbols = [...symbols];
      for (let j = 0; j < 3; j++) {
        const randomIndex = Math.floor(Math.random() * reelSymbols.length);
        reels[i].push(reelSymbols[randomIndex]);
        reelSymbols.splice(randomIndex, 1);
      }
    }
    return reels;
  };
  
  const transposeReels = (reels) => {
    const rows = [];
    for (let i = 0; i < 3; i++) {
      rows.push([]);
      for (let j = 0; j < 3; j++) {
        rows[i].push(reels[j][i]);
      }
    }
    return rows;
  };
  
  const displayReels = (rows) => {
    reelsDisplay.innerHTML = "";
    for (const row of rows) {
      for (const symbol of row) {
        const reelElement = document.createElement("div");
        reelElement.classList.add("reel");
        reelElement.textContent = symbol;
        reelsDisplay.appendChild(reelElement);
      }
      // reelsDisplay.appendChild(document.createElement("br"));
    }
  };
  
  const calculateWinnings = (rows, bet, lines) => {
    let winnings = 0;
  
    for (let row = 0; row < lines; row++) {
      const symbols = rows[row];
      let allSame = true;
  
      for (const symbol of symbols) {
        if (symbol !== symbols[0]) {
          allSame = false;
          break;
        }
      }
  
      if (allSame) {
        winnings += bet * SYMBOLS_VALUES[symbols[0]];
      }
    }
    return winnings;
  };
  
