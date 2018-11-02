 /**
     * Holds information about the whole snake, including a list of SnakeSegmentModels
     * @param {Position2D} position a Position2D instance
     */

import Position2D from './position2D';
import SnakeSegmentModel from './snakeSegmentModel';


export default class SnakeModel {
    constructor(position) {
    if(!(position instanceof Position2D)) {
      throw new TypeError("Invalid Position2D Instance");
    }

    this.segments  = [new SnakeSegmentModel(position), new SnakeSegmentModel(new Position2D(position.x + 1, position.y))];
    this.direction = 39;
    // this.direction = root.DIR_RIGHT;
    this.destroyed = false;
    this.cause     = '';
    this.sounds    = {};
    this.score     = 0;
    this.font      = window.FONTS.score;
    this.color     = "#ffffff";
  }
}