/**
     * The view for the whole SnakeModel and SnakeSegmentModels contained by it
     * @param {SnakeModel} modSnake a SnakeModel instance
     * @param {LevelModel} modLevel a LevelModel instance
     * @param {Object}     context  a 2D drawing context
     */

import SnakeModel from '../model/snakeModel';
import LevelModel from '../model/levelModel';

export default class SnakeView {
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
    var i, x, y/*, h*/;

    this.context.fillStyle = "#003300";
    this.context.strokeStyle = "#009900";
    for(i = 0; i < this.modSnake.segments.length; i += 1) {
      x = 0.5 + this.modSnake.segments[i].x * this.modLevel.csize;
      y = 0.5 + this.modSnake.segments[i].y * this.modLevel.csize;

      /*
                h = ((i / this.modSnake.segments.length) * 360);
                this.context.fillStyle = 'hsl(' + h + ', 100%, 50%)';
                this.context.strokeStyle = 'hsl(' + h + ', 100%, 70%)';
            */

      this.context.beginPath();
      this.context.rect(x, y, this.modLevel.csize, this.modLevel.csize);
      this.context.fill();
      this.context.stroke();
      this.context.closePath();
    }
  }
}