class gamestate {
  constructor() {
    this.state = "pause";
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
}

export { gamestate };
