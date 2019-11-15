import { log } from "util";
import { getElem } from "./util";

export default class MarioGame {
  constructor(numberOfGrids, container) {
    this.numberOfGrids = numberOfGrids;
    this.marioX = 0;
    this.marioY = 0;
    this.direction = "R"; // "L", "R", "U", "D"
    this.isPlaying = false;

    this.drawGrid(container);
    this.placeMario();
    this.playInterval = null;
  }

  play() {
    this.isPlaying = true;
    this.playInterval = setInterval(() => {
      this.placeMario();
      this.updateNextPosition();
    }, 1000);
  }

  pause() {
    if (this.isPlaying) {
      clearInterval(this.playInterval);
      this.isPlaying = false;
    }
  }

  changeDirection(direction) {
    log(`change direction to ${direction}`);
    this.direction = direction;
  }

  drawGrid(container) {
    // log("drawing grid");
    // draw a grid of N*N,

    const poisonIndes = this.generateRandomPoisonIndex(this.numberOfGrids);
    // log(poisonIndes);

    for (let i = 0; i < this.numberOfGrids; i++) {
      container.appendChild(this.generateARow(i, poisonIndes));
    }
  }

  // generate a random index from N*N and return array of index
  generateRandomPoisonIndex() {
    let randoms = [];
    while (randoms.length <= this.numberOfGrids) {
      let currentNumber = Math.floor(
        Math.random() * this.numberOfGrids * this.numberOfGrids
      );
      if (randoms.indexOf(currentNumber) < 0) {
        randoms.push(currentNumber);
      }
    }
    return randoms;
  }

  getSingleBlock(id, hasPoison) {
    const block = document.createElement("div");

    block.innerHTML = `
      <div class="single-block ${
        hasPoison ? "poison" : ""
      }" data-location-id = '${id}'
        data-has-poison="${hasPoison}" > </div>`;
    return block;
  }

  generateARow(rowIndex, poisonNodes) {
    const row = document.createElement("div");

    row.classList.add("row");

    for (let i = 0; i < this.numberOfGrids; i++) {
      const index = rowIndex * this.numberOfGrids + i;
      const id = `${rowIndex}:${i}:${index}`;
      const hasPoison = poisonNodes.indexOf(index) > 0;

      row.appendChild(this.getSingleBlock(id, hasPoison));
    }
    return row;
  }

  generateSelectorId(rowId, colId) {
    return `${rowId}:${colId}:${rowId * this.numberOfGrids + colId}`;
  }

  // set the position as [rowId:colId:]
  placeMario() {
    let el = getElem(".single-block.mario");
    if (el) {
      el.classList.remove("mario");
    }

    const id = this.generateSelectorId(this.marioX, this.marioY);
    log(id);
    let marioEl = document.querySelector(
      `.single-block[data-location-id='${id}']`
    );
    if (marioEl) {
      marioEl.classList.add("mario");
    }
  }

  updateNextPosition() {
    log(`current position ${this.marioX} : ${this.marioY}`);
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
    log(`next position ${this.marioX} : ${this.marioY}`);
    log(this.generateSelectorId(this.marioX, this.marioY));
    this.placeMario();
  }
}
