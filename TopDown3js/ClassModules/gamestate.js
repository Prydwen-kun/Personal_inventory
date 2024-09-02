class gamestate {
  constructor() {
    this.state = "pause";
    this.deltaSum = 0;
    this.timer = 0;
    this.score = 0;
    this.playerMaxY = 0;
  }
  setGameState(action) {
    switch (action) {
      case "pause":
        this.state = "pause";
        break;
      case "game":
        this.state = "game";
        break;
      case "menu":
        this.state = "menu";
        break;
    }
  }

  getGameState() {
    return this.state;
  }

  stepClockSec(deltaTimeStoring) {
    this.deltaSum += deltaTimeStoring;
    if (this.deltaSum >= 1) {
      this.timer++;
      this.deltaSum = 0;
    }
  }
  updateScore(playerYpos) {
    if (playerYpos > this.playerMaxY) {
      this.playerMaxY = playerYpos;
    }
    this.score = Math.trunc(this.playerMaxY * 10);
  }
}

export { gamestate };
