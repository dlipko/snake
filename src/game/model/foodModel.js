 /**
     * Used to determine the position, type, lifetime and birthtime of Food.
     * The SnakeController manages expiring food and placing new food. 
     */
import Position2D from './position2D';

export default class FoodModel {
  constructor() {
    this.init(new Position2D(0, 0));
  }

  init(position, type) {
    this.position = position;
    this.type     = type || 0;
    this.life     = 15000;
    this.birth    = Date.now();
    this.age      = 0;
  }
}
