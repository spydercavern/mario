import { log } from "util";
import { getElem } from "./util";

export default class MarioGame {
  constructor(numberOfGrids, container) {
    this.numberOfGrids = numberOfGrids;
    this.container = container;
    this.marioX = 0;
    this.marioY = 0;
    this.direction = "R"; // "L", "R", "U", "D"
    this.isPlaying = false;
    this.mushroomIndex = null;
    this.currentSpeed = 500;

    this.playInterval = null;
    this.currentScore = 0;
    this.initGame();
  }

  play(interval = this.currentSpeed) {
    if (this.isPlaying) {
      return;
    }

    log(`speed now ${interval}`);
    this.isPlaying = true;
    this.playInterval = setInterval(() => {
      this.placeMario(false);
      this.updateNextPosition();
    }, interval);
  }

  speedUpTheGame() {
    if (this.isPlaying && this.playInterval !== null) {
      clearInterval(this.playInterval);
      this.isPlaying = false;
      this.play(this.getVariableSpeed());
    }
  }

  getVariableSpeed() {
    if (this.currentScore > 0 && this.currentScore < 5) {
      return 400;
    }
    if (this.currentScore >= 5 && this.currentScore < 10) {
      return 300;
    }
    if (this.currentScore >= 10 && this.currentScore < 20) {
      return 200;
    }
    if (this.currentScore >= 20) {
      return 100;
    }
  }

  pause() {
    if (this.isPlaying) {
      clearInterval(this.playInterval);
      this.isPlaying = false;
    }
  }

  restart() {
    this.container.innerHTML = "";
    this.initGame();
  }

  initGame() {
    this.mushroomIndex = null;
    this.currentScore = 0;
    this.placeMushroom();
    this.poisionIndices = this.generateRandomPoisonIndex(this.numberOfGrids);
    this.drawGrid(this.container);
    this.placeMario();
  }

  randomizePoisons() {
    this.container.querySelectorAll(".poison").forEach(el => {
      el.classList.remove("poison");
    });
    this.poisionIndices = this.generateRandomPoisonIndex(this.numberOfGrids);

    for (const index of this.poisionIndices) {
      let poisonEl = `.single-block[data-index='${index}']`;
      this.container.querySelector(poisonEl).classList.add("poison");
    }
  }

  placeMushroom() {
    if (this.mushroomIndex === null) {
      this.mushroomIndex = Math.floor(
        Math.random() * this.numberOfGrids * this.numberOfGrids + 1
      );
    } else {
      // remove existing mushroom and randomly place new Mushroom;
      let mushroomEl = this.container.querySelector(".mushroom");
      mushroomEl.classList.remove("mushroom");
      // generate a next id for mushroom,
      let nextIndex = this.getNextPositionForMushroom();
      // log(`next position for mario ${nextIndex}`);
      let nextMushroomEl = this.container.querySelector(
        `.single-block[data-index='${nextIndex}']`
      );
      nextMushroomEl.classList.add("mushroom");
    }
  }

  getNextPositionForMushroom() {
    let invalidPositions = [this.mushroomIndex, ...this.poisionIndices];
    let keepFinding = true;
    let index = null;
    while (keepFinding) {
      let tempPosition = Math.floor(
        Math.random() * this.numberOfGrids * this.numberOfGrids
      );
      if (invalidPositions.indexOf(tempPosition) >= 0) {
        keepFinding = true;
      } else {
        index = tempPosition;
        keepFinding = false;
      }
    }
    return index;
  }

  changeDirection(direction) {
    // log(`change direction to ${direction}`);
    this.direction = direction;
  }

  drawGrid(container) {
    // log(`drawing grid with mushroom at ${this.mushroomIndex}`);
    // draw a grid of N*N,
    container.innerHTML = "";
    for (let i = 0; i < this.numberOfGrids; i++) {
      container.appendChild(this.generateARow(i));
    }
  }

  // generate a random index from N*N and return array of index
  generateRandomPoisonIndex() {
    let randoms = [];
    const restrictedIndices = this.getNearByLocationIndex();
    while (randoms.length < this.numberOfGrids) {
      let currentNumber = Math.floor(
        Math.random() * this.numberOfGrids * this.numberOfGrids
      );
      if (
        randoms.indexOf(currentNumber) < 0 &&
        this.mushroomIndex !== currentNumber &&
        !restrictedIndices.has(currentNumber)
      ) {
        randoms.push(currentNumber);
      }
    }
    return randoms;
  }

  getNearByLocationIndex() {
    let indices = new Set();
    for (let i = 0; i < 3; i++) {
      if (this.marioX + 1 < this.numberOfGrids) {
        indices.add((this.marioX + 1) * this.numberOfGrids + this.marioY);
      }
      if (this.marioX - 1 < this.numberOfGrids) {
        indices.add((this.marioX - 1) * this.numberOfGrids + this.marioY);
      }
    }
    for (let i = 0; i < 3; i++) {
      if (this.marioY + 1 < this.numberOfGrids) {
        indices.add(this.marioX * this.numberOfGrids + (this.marioY + i));
      }
      if (this.marioY - 1 < this.numberOfGrids) {
        indices.add(this.marioX * this.numberOfGrids + (this.marioY - i));
      }
    }
    return indices;
  }

  getSingleBlock(index, id, hasPoison, hasMushRoom) {
    const block = document.createElement("div");

    block.innerHTML = `
      <div class="single-block ${hasPoison ? "poison" : ""} ${
      hasMushRoom ? "mushroom" : ""
    }"  data-location-id = '${id}'
      data-index='${index}'
        data-has-poison="${hasPoison}"> ${index}</div>`;
    return block;
  }

  generateARow(rowIndex) {
    const row = document.createElement("div");

    row.classList.add("row");

    for (let i = 0; i < this.numberOfGrids; i++) {
      const index = rowIndex * this.numberOfGrids + i;
      const id = `${rowIndex}:${i}:${index}`;
      const hasPoison = this.poisionIndices.indexOf(index) > 0;

      row.appendChild(
        this.getSingleBlock(index, id, hasPoison, index === this.mushroomIndex)
      );
    }
    return row;
  }

  generateSelectorId(rowId, colId) {
    return `${rowId}:${colId}:${rowId * this.numberOfGrids + colId}`;
  }

  // set the position as [rowId:colId:]
  placeMario(winCheck = true) {
    let el = getElem(".single-block.mario");
    if (el) {
      el.classList.remove("mario");
    }

    const id = this.generateSelectorId(this.marioX, this.marioY);
    let marioEl = document.querySelector(
      `.single-block[data-location-id='${id}']`
    );
    if (marioEl) {
      marioEl.classList.add("mario");
      // check if in poision or on mushroom
      if (winCheck) {
        this.checkForWinOrPoison(marioEl);
      }
    }
  }

  checkForWinOrPoison(marioEl) {
    const classList = marioEl.classList;

    // console.log(`current score ${this.currentScore}`);
    if (classList.contains("poison")) {
      this.pause();

      this.dispatchGameEvent("game-over", { score: this.currentScore });
      alert("game over");
      this.restart();
    }
    if (classList.contains("mushroom")) {
      this.randomizePoisons();
      this.placeMushroom();
      this.speedUpTheGame();
      this.dispatchGameEvent("eat-mushroom", { score: ++this.currentScore });
    }
  }

  updateNextPosition() {
    // log(`current position ${this.marioX} : ${this.marioY}`);
    if (this.direction === "D") {
      this.marioX = this.marioX + 1 < this.numberOfGrids ? this.marioX + 1 : 0;
    } else if (this.direction === "R") {
      this.marioY = this.marioY + 1 < this.numberOfGrids ? this.marioY + 1 : 0;
    } else if (this.direction === "L") {
      this.marioY =
        this.marioY - 1 < 0 ? this.numberOfGrids - 1 : this.marioY - 1;
    } else if (this.direction === "U") {
      this.marioX =
        this.marioX - 1 < 0 ? this.numberOfGrids - 1 : this.marioX - 1;
    }
    // log(`next position ${this.marioX} : ${this.marioY}`);
    // log(this.generateSelectorId(this.marioX, this.marioY));
    this.placeMario();
  }

  dispatchGameEvent(eventNam, data) {
    let event = new CustomEvent(eventNam, { detail: data });
    this.container.dispatchEvent(event);
  }
}
