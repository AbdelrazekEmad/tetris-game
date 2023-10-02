document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  let squeres = Array.from(document.querySelectorAll(".grid div"));
  let takenSqueres = Array.from(document.querySelectorAll(".grid .taken"));
  const scoreDesplay = document.querySelector("#score");
  const startBtn = document.querySelector("#start-button");
  const width = 10;
  const gameOverModle = document.querySelector(".gameovey-modle");
  const modleScoreDesplay = document.querySelector("#modle-score");
  const highScoreDesplay = document.querySelector(".high-score span");
  let nextRandom = 0;
  let timerId;
  let score = 0;
  const colors = ["#98db57", "#de6652", "#4cd5b1", "#5ebee1", "#eb964a"];

  //function to play sound
  function soundPlay() {
    var audio = new Audio("./tetrominoSound.m4a");
    audio.play();
  }

  function checkHighScore() {
    if (localStorage.getItem("score")) {
      highScoreDesplay.innerHTML = localStorage.getItem("score");
    }
  }
  checkHighScore();

  // The Tetrominoes
  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ];
  const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
  ];
  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
  ];
  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ];
  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
  ];

  const theTetrominoes = [
    lTetromino,
    zTetromino,
    tTetromino,
    oTetromino,
    iTetromino,
  ];

  let currentPosition = 4;
  let currentRotation = 0;

  // to select a random tetromino
  let radnom = Math.floor(Math.random() * theTetrominoes.length);
  let current = theTetrominoes[radnom][currentRotation];

  //   draw the Tetromino
  function draw() {
    current.forEach((index) => {
      squeres[currentPosition + index].classList.add("tetromino");
      squeres[currentPosition + index].style.backgroundColor = colors[radnom];
    });
  }

  function unDraw() {
    current.forEach((index) => {
      squeres[currentPosition + index].classList.remove("tetromino");
      squeres[currentPosition + index].style.backgroundColor = "";
    });
  }

  //assign function to keycodes
  document.addEventListener("keyup", control);
  function control(e) {
    if (e.keyCode === 37) {
      moveLeft();
    } else if (e.keyCode === 38) {
      rotate();
    } else if (e.keyCode === 39) {
      moveRight();
    } else if (e.keyCode === 40) {
      moveDown();
    }
  }

  function moveDown() {
    unDraw();
    currentPosition += width;
    draw();
    freeze();
  }

  // stop the tetromino if it hite bottom freeze function
  function freeze() {
    if (
      current.some((index) =>
        squeres[currentPosition + index + width].classList.contains("taken")
      )
    ) {
      // add class taken to the next position will freeze
      current.forEach((index) =>
        squeres[currentPosition + index].classList.add("taken")
      );
      // if it true update the values of positon
      radnom = nextRandom;
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      current = theTetrominoes[radnom][currentRotation];
      currentPosition = 4;
      draw();
      displayShape();
      addScore();
      gameOver();
    }
  }

  // move the tetromino left unless is at the adge or there is a blockage
  function moveLeft() {
    unDraw();
    const isAtLeftAdge = current.some(
      (index) => (currentPosition + index) % width === 0
    );
    if (!isAtLeftAdge) currentPosition -= 1;
    // to stop the tetromino to move if left hand side has tetromino
    if (
      current.some((index) =>
        squeres[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition += 1;
    }
    draw();
    soundPlay();
  }

  // move the tetromino right unless is at the adge or there is a blockage
  function moveRight() {
    unDraw();
    const isAtRightAdge = current.some(
      (index) => (currentPosition + index) % width === width - 1
    );
    if (!isAtRightAdge) currentPosition += 1;
    // to stop the tetromino to move if Right hand side has tetromino
    if (
      current.some((index) =>
        squeres[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition -= 1;
    }
    draw();
    soundPlay();
  }

  //rotate the tetromino
  function rotate() {
    unDraw();
    currentRotation++;
    if (currentRotation === current.length) {
      currentRotation = 0;
    }
    current = theTetrominoes[radnom][currentRotation];
    draw();
    soundPlay();
  }

  // show up-next tetromino in mini-grid
  const displaySquares = document.querySelectorAll(".mini-grid div");
  const displayWidth = 4;
  const displayIndex = 0;

  // the Tetrominos without rotation
  const upNextTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], //lTetromino
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //zTetromino
    [1, displayWidth, displayWidth + 1, displayWidth + 2], //tTetromino
    [0, 1, displayWidth, displayWidth + 1], //oTetromino
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], //iTetromino
  ];

  //display the shape in the mini-grid display
  function displayShape() {
    //remove any trace of a tetromino from the entire grid
    displaySquares.forEach((square) => {
      square.classList.remove("tetromino");
      square.style.backgroundColor = "";
    });
    upNextTetrominoes[nextRandom].forEach((index) => {
      displaySquares[displayIndex + index].classList.add("tetromino");
      displaySquares[displayIndex + index].style.backgroundColor =
        colors[nextRandom];
    });
  }

  //add function to stop and puse batton
  startBtn.addEventListener("click", () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
      startBtn.classList.remove("pause");
    } else {
      draw();
      timerId = setInterval(moveDown, 500);
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      startBtn.classList.add("pause");
      displayShape();
    }
  });

  //add score
  function addScore() {
    for (let i = 0; i < squeres.length - takenSqueres.length - 1; i += width) {
      const row = [
        i,
        i + 1,
        i + 2,
        i + 3,
        i + 4,
        i + 5,
        i + 6,
        i + 7,
        i + 8,
        i + 9,
      ];
      if (row.every((index) => squeres[index].classList.contains("taken"))) {
        score += 10;
        scoreDesplay.innerHTML = score;
        modleScoreDesplay.innerHTML = score;
        if (+localStorage.getItem("score") < score) {
          localStorage.setItem("score", score);
        }
        row.forEach((index) => {
          squeres[index].classList.remove("taken");
          squeres[index].classList.remove("tetromino");
          squeres[index].style.backgroundColor = "";
        });
        const squaresRmove = squeres.splice(i, width);
        squeres = squaresRmove.concat(squeres);
        squeres.forEach((cell) => grid.appendChild(cell));
      }
    }
  }

  //game over
  function gameOver() {
    if (
      current.some((index) =>
        squeres[currentPosition + index].classList.contains("taken")
      )
    ) {
      scoreDesplay.innerHTML = "end";
      gameOverModle.classList.add("active");
      clearInterval(timerId);
    }
  }

  //when its game over and click on play button on modle ,hide and start game
  document.getElementById("modle-start-btn").addEventListener("click", () => {
    gameOverModle.classList.remove("active");
    location.reload();
  });
});
