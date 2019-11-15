import { getElem, log } from "./util";
import MarioGame from "./Game";
import "../styles/index.scss";

window.addEventListener("DOMContentLoaded", event => {
  console.log("DOM fully loaded and parsed");
  init();
});

const NUMBER_OF_GRIDS = 10;
let game = null;
let gameContainer = null;

const init = () => {
  // fetch the number of grids from the user
  const numberOfGrids = getUserInput();

  // const numberOfGrids = NUMBER_OF_GRIDS;
  gameContainer = getElem(".game-container");
  initEventHandlers(gameContainer);
  game = new MarioGame(numberOfGrids, gameContainer);
};

const initEventHandlers = async () => {
  var btnEl = document.querySelector("#start-btn");
  btnEl.addEventListener("click", () => {
    if (game && !game.isPlaying) {
      game.play();
    }
  });

  var payseBtnEl = document.querySelector("#pause-btn");
  payseBtnEl.addEventListener("click", () => {
    if (game) {
      game.pause();
    }
  });

  document.addEventListener("keydown", handleKeyDown);

  function handleKeyDown(e) {
    if (game && !game.isPlaying) {
      game.play();
    }
    if (e.keyCode === 38) {
      //up arrow
      game.changeDirection("U"); // up arrow
    } else if (e.keyCode === 40) {
      game.changeDirection("D");
    } else if (e.keyCode === 37) {
      game.changeDirection("L");
    } else if (e.keyCode === 39) {
      game.changeDirection("R");
    }
  }
};

const getUserInput = () => {
  return window.prompt("Number of Grids", `${NUMBER_OF_GRIDS}`);
};
