class UI_data {
  constructor() {
    this.page = document;
    this.scoreElement = this.page.getElementById("gameScore");
    this.timerElement = this.page.getElementById("gameTimer");
  }
  displayGameData(timer, score) {
    this.timerElement.innerHTML = timer.toString();
    this.scoreElement.innerHTML = score.toString();
  }
}
export { UI_data };
