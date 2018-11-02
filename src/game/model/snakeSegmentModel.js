/**
     * Holds information about a single Snake segment / body part.
     * @param {Position2D} position a Position2D instance
     */

import Position2D from './position2D';

export default class SnakeSegmentModel {
    constructor(position) {
      if(!(position instanceof Position2D)) {
        throw new TypeError("Invalid Position2D Instance");
      }

      this.x = position.x;
      this.y = position.y;
  }
}