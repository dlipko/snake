  /**
     * The view for the score, stored in SnakeModel
     * @param {SnakeModel} modSnake a SnakeModel instance
     * @param {LevelModel} modLevel a LevelModel instance
     * @param {Object}     context  a 2D drawing context
     */

import SnakeModel from '../model/snakeModel';
import LevelModel from '../model/levelModel';

export default class ScoreView {
    constructor(modSnake, modLevel, context) {
    if(!(modSnake instanceof SnakeModel)) {
      throw new TypeError("Invalid SnakeModel instance");
    }

    if(!(modLevel instanceof LevelModel)) {
      throw new TypeError("Invalid LevelModel instance");
    }

    this.context  = context;
    this.modSnake = modSnake;
    this.modLevel = modLevel;
  }

  /**
     * Called by the Application controller
     */
  render() {
    var h = (this.modLevel.height * this.modLevel.csize) + 33,
        cx = 5, 
        cy = (h - this.modSnake.font.size - this.modSnake.font.size / 2);

    this.context.font         = this.modSnake.font.toString();
    this.context.fillStyle    = this.modSnake.color;    
    this.context.textAlign    = "left";
    this.context.textBaseline = "middle";
    this.context.fillText("Score: " + this.modSnake.score, cx, cy);
  }
}