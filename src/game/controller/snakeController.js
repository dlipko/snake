/**
     * One of the biggest controllers in the application, the one that controls the snake
     * and the snake food. 
     * @param {SnakeModel}         snakeModel         a SnakeModel instance
     * @param {LevelModel}         levelModel         a LevelModel instance
     * @param {KeyboardController} keyboardController a KeyboardController instance
     */

import SnakeModel from '../model/snakeModel';
import LevelModel from '../model/levelModel';
import KeyboardController from '../controller/keyboardController';

import Position2D from '../model/position2D';

export default class SnakeController {
    constructor(snakeModel, levelModel, keyboardController) {
    var rec;

    if(!(snakeModel instanceof SnakeModel)) {
      throw new TypeError("Invalid SnakeModel instance.");
    }

    if(!(levelModel instanceof LevelModel)) {
      throw new TypeError("Invalid LevelModel instance.");
    }

    if(!(keyboardController instanceof KeyboardController)) {
      throw new TypeError("Invalid KeyboardController instance.");
    }

    this.modSnake    = snakeModel;
    this.modLevel    = levelModel;
    this.ctrKeyboard = keyboardController;
    this.timePrint   = Date.now();

    // find enough space in the level for our snake to start from, it needs at least 3 cells. 
    while(true) {
      rec = this.modLevel.emptyCell();
      if(this.modLevel.getField(rec.x + 1, rec.y) === 0 && this.modLevel.getField(rec.x + 2, rec.y) === 0) {
        this.modSnake.segments[0].x = rec.x;
        this.modSnake.segments[0].y = rec.y;
        this.modSnake.segments[1].x = rec.x + 1;
        this.modSnake.segments[1].y = rec.y;

        break; 
      }
    }

    // place some food
    this.newFood();
  }

  /**
     * Move the snake one step, in the set direction.
     * @returns {Boolean} returns true if the movement is hitting a cell but is harmless, 
     *                    false when snake dies and null if all is well.
     */
  move() {
    var nx = this.modSnake.segments[0].x, // head x
        ny = this.modSnake.segments[0].y, // head y
        nt, nf, i;

    // new position
    if(this.modSnake.direction === DIR_RIGHT) {
      nx += 1;
    } else if(this.modSnake.direction === DIR_LEFT) {
      nx -= 1;
    } else if(this.modSnake.direction === DIR_DOWN) {
      ny += 1;
    } else if(this.modSnake.direction === DIR_UP) {
      ny -= 1;
    }

    // wrap around the world, x-axis first
    if(nx >= this.modLevel.width) {
      nx = 0;
    } else if(nx < 0) {
      nx = (this.modLevel.width - 1);
    }

    // y-axis
    if(ny >= this.modLevel.height) {
      ny = 0;
    } else if(ny < 0) {
      ny = (this.modLevel.height - 1);
    }

    // try collision with level entities
    nf = this.modLevel.getField(nx, ny);
    switch(nf) {
      case 1: // cell type 1 is a green cell, just notify the player with a thump.
        this.modSnake.sounds.thump.play();
        return true;

      case 2: // cell type 2 is the deadly red kind, kill it! 
        this.modSnake.sounds.death.play();
        this.modSnake.destroyed = true;
        this.modSnake.cause = "wall";
        return false;
    }

    // try collision with snake segments
    for(i = 0; i < this.modSnake.segments.length - 1; i += 1) {
      if(this.modSnake.segments[i].x === nx && this.modSnake.segments[i].y === ny) {
        this.modSnake.sounds.death.play();
        this.modSnake.destroyed = true;
        this.modSnake.cause = "snake";
        return false;
      }
    }

    // collision with a piece of food? If so, add a new snake segment and piece of food.
    if(this.modLevel.food.position.x === nx && this.modLevel.food.position.y === ny) {
      nt = new Position2D(nx, ny);

      this.modSnake.sounds.pickup.play();
      if(!this.newFood()) {
        this.modSnake.sounds.death.play();
        this.modSnake.destroyed = true;
        this.modSnake.cause = "obesity";
      }
      this.modSnake.score += (this.modLevel.food.type + 1) * 2;
    } else {
      // nothing happened, pop a tail segment as the 'new' head element
      nt = this.modSnake.segments.pop();
      nt.x = nx; nt.y = ny;
    }

    // place the new element at the front of the array
    this.modSnake.segments.unshift(nt);
  }

  /**
     * Change the direction of the snake, by simply changing the head's direction.
     * @param {Number} direction a direction constant, such as DIR_UP, DIR_DOWN.
     */
  setDirection(direction) {
    if(this.modSnake.direction !== direction && DIR_INV[this.modSnake.direction] !== direction) {
      this.modSnake.direction = direction;
      this.move();
      this.timePrint = Date.now();
    }
  }

  /**
     * Update the Snake's position and direction, when required.
     */
  update() {
    if(this.ctrKeyboard.isKeyDown(KEY_UP)) {
      this.setDirection(DIR_UP);
    } else if(this.ctrKeyboard.isKeyDown(KEY_DOWN)) {
      this.setDirection(DIR_DOWN);
    } else if(this.ctrKeyboard.isKeyDown(KEY_LEFT)) {
      this.setDirection(DIR_LEFT);
    } else if(this.ctrKeyboard.isKeyDown(KEY_RIGHT)) {
      this.setDirection(DIR_RIGHT);
    }

    var now = Date.now(),
        dif = (now - this.timePrint);

    if(dif >= 200) {
      // actually move left, up, right or down.
      this.move();
      this.timePrint = now;
    }
  }

  /** 
     * Place new food in the level.
     * @returns {Boolean} true when new food could be placed and false when the player has finished playing. 
     */
  newFood() {
    var rpos = this.modLevel.emptyCell(this.modSnake.segments);
    if(rpos) {
      this.modLevel.food.init(rpos, Math.floor(Math.random() * 3));
      return true;
    }

    return false;
  }

  /**
     * Check if the Snake is dead!
     * @returns {Boolean} living state
     */
  isDestroyed() {
    return !!this.modSnake.destroyed;
  }
}