  /**
     * The view for the whole LevelModel
     * @param {LevelModel} model   the LevelModel instance
     * @param {Object}     context a 2D drawing context
     */

import LevelModel from '../model/levelModel';

export default class LevelView {
    constructor(model, context) {
    this.context  = context;
    if(model instanceof LevelModel) {
      this.model = model;
    } else {
      throw new TypeError("Invalid model instance");
    }
  }

  /**
     * Called by the Application controller
     */
  render() {
    var x, y, field, cx, cy, color, stroke;
    this.context.fillStyle = "#000000";
    this.context.lineWidth = 1;
    this.context.lineCap = "square";
    this.context.fillRect(0, 0, this.model.width * this.model.csize, this.model.height * this.model.csize);

    // grid
    for(x = 0; x < this.model.width; x += 1) {
      for(y = 0; y < this.model.height; y += 1) {
        cx = (x * this.model.csize) + 0.5;
        cy = (y * this.model.csize) + 0.5;

        this.context.strokeStyle = "#111111";
        this.context.beginPath();
        this.context.rect(cx, cy, this.model.csize, this.model.csize);
        this.context.stroke();
        this.context.closePath();
      }
    }

    // obstacles
    for(x = 0; x < this.model.width; x += 1) {
      for(y = 0; y < this.model.height; y += 1) {
        field = this.model.getField(x, y);
        cx = (x * this.model.csize) + 0.5;
        cy = (y * this.model.csize) + 0.5;

        color = null;
        switch(field) {
          case 1: 
            color = "#003300";
            stroke = "#00ff00";
            break;

          case 2: 
            color = "#330000";
            stroke = "#ff0000";
            break;
        }

        if(color) {
          this.context.strokeStyle = stroke;
          this.context.fillStyle = color;
          this.context.beginPath();
          this.context.rect(cx, cy, this.model.csize, this.model.csize);
          this.context.fill();
          this.context.stroke();
          this.context.closePath();
        }
      }
    }

    // food
    cx = (this.model.food.position.x * this.model.csize) + 0.5;
    cy = (this.model.food.position.y * this.model.csize) + 0.5;

    switch(this.model.food.type) {
      case 0: 
        this.context.fillStyle = "#00ff00";
        break;

      case 1: 
        this.context.fillStyle = "#ffff00";
        break;

      case 2: 
        this.context.fillStyle = "#00ffff";
        break;
    }
    this.context.fillRect(cx, cy, this.model.csize, this.model.csize);
  }
}