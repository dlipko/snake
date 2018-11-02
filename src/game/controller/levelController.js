  // very simple controller to init food data when timed out on level update

import LevelModel from '../model/levelModel';
import FoodModel from '../model/foodModel';
import SnakeModel from '../model/snakeModel';

export default class LevelController {
    constructor(modLevel, modFood, modSnake) {
    if(!(modLevel instanceof LevelModel)) {
      throw new TypeError("Invalid LevelModel instance");
    }

    if(!(modFood instanceof FoodModel)) {
      throw new TypeError("Invalid FoodModel instance");
    }

    if(!(modSnake instanceof SnakeModel)) {
      throw new TypeError("Invalid SnakeModel instance");
    }

    this.modSnake      = modSnake;
    this.modLevel      = modLevel;
    this.modLevel.food = modFood;
  }

  update() {
    if((Date.now() - this.modLevel.food.birth) >= this.modLevel.food.life) {
      this.modSnake.score -= 3;
      if(this.modSnake.score < 0) { 
        this.modSnake.score = 0;
      }

      this.modLevel.food.init(this.modLevel.emptyCell(), Math.floor(Math.random() * 3));
    }
  }
}