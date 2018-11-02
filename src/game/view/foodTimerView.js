 /**
     * The view for the FoodModel, controlled by SnakeController
     * @param {FoodModel}  modFood  the FoodModel instance, containing the birth and lifetime
     * @param {LevelModel} modLevel a LevelModel instance, used for dimensions
     * @param {Object}     context  a 2D drawing context
     */
import FoodModel from '../model/foodModel';
import LevelModel from '../model/levelModel';

export default class FoodTimerView {
    constructor(modFood, modLevel, context) {
      if(!(modFood instanceof FoodModel)) {
        throw new TypeError("Invalid FoodModel instance");
      }

      if(!(modLevel instanceof LevelModel)) {
        throw new TypeError("Invalid LevelModel instance");
      }

      this.modFood  = modFood;
      this.modLevel = modLevel;
      this.context  = context;
    }

  /**
     * Called by the Application controller
     */
  render() {
    var timeDiff    = (Date.now() - this.modFood.birth),
        passedTime  = (timeDiff / this.modFood.life),
        sizeFactor  = 0.5,
        levelWidth  = (this.modLevel.width * this.modLevel.csize) + 1,
        levelHeight = (this.modLevel.height * this.modLevel.csize) + 33,
        barLimit    = (levelWidth * sizeFactor),
        barWidth    = barLimit - (levelWidth * (sizeFactor * passedTime)),
        barHeight   = 22,
        positionX   = (levelWidth - barLimit - 5) + 0.5,
        positionY   = (levelHeight - barHeight - 5) + 0.5;

    this.context.lineWidth = 1;
    this.context.strokeStyle = '#333333';
    this.context.strokeRect(positionX, positionY, barLimit, barHeight);

    this.context.beginPath();
    this.context.rect(positionX, positionY, barWidth, barHeight);
    this.context.fillStyle   = '#00be00';
    this.context.strokeStyle = '#cecece';
    this.context.fill();
    this.context.stroke();
    this.context.closePath();
  }
}
