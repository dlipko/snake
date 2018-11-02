/* All functions in this model are data-logic */

  /**
     * new Level(). Construct a new level object
     * @param {Number} width  Width in columns
     * @param {Number} height Height in rows
     * @param {Object} data   A one-dimensional array with the level data.
     *                        data: a 0 is clear, a 1 is a wall, 2 is death, 3 is start, 10 is an invisible used cell
     */
import FoodModel from './foodModel';
import Position2D from './position2D';

export default class LevelModel {
    constructor (width, height, data, csize = 15) {
      var i, j, diff;

      this.csize  = csize; // cell size
      this.width  = width;
      this.height = height;

      // this.food = null;
      this.food = new FoodModel();

      // clone instead of referencing
      this.wdata = new Array(width * height); // work data
      this.odata = new Array(width * height); // original data

      if(data.length > 0) {
        for(i = 0; i < data.length; i += 1) {
          this.wdata[i] = this.odata[i] = data[i];
        }

        diff = (data.length - (width * height));
        if(diff > 0) {
          j = data.length;
          for(i = 0; i < diff; i += 1) {
            this.wdata[i + j] = this.odata[i + j] = 0;
          }
        }
      } else {
        for(i = 0; i < (width * height); i += 1) {
          this.wdata[i] = this.odata[i] = 0;
        }
      }
  }

  /**
     * Restore the original level state
     */
  reset() {
    var i;
    for(i = 0; i < this.odata.length; i += 1) {
      this.wdata[i] = this.odata[i];
    }
  }

  /**
     * Get index from x and y coordinates in the level grid
     * @param   {Number} x x-coordinate
     * @param   {Number} y y-coordinate
     * @returns {Number} field index
     */
  index(x, y) {
    return ((y * this.width) + x);        
  }

  /**
     * Get field from wdata from x and y coordinates in the level grid
     * @param   {Number} x x-xoordinate
     * @param   {Number} y y-coordinate
     * @returns {Number} field content
     */
  getField(x, y) {
    return this.wdata[this.index(x, y)];
  }

  /**
     * Return a random empty cell from the model, data logic
     * @param   {Array}  positionList a list of objects containing x and y coordinates to also check against.
     * @returns {Object} Position2D object
     */
  emptyCell(positionList) {
    var attempt = 0, rx, ry, ri, i, found, hpl = typeof positionList === "object", result = null;

    while(attempt < this.wdata.length) {
      rx = Math.floor(Math.random() * this.width);
      ry = Math.floor(Math.random() * this.height);
      ri = this.index(rx, ry);

      found = false;

      if(hpl) {
        for(i = 0; i < positionList.length; i += 1) {
          if(positionList[i].x === rx && positionList[i].y === ry) {
            found = true;
            break; 
          }
        } 
      }


      if(!found && this.wdata[ri] === 0) {
        result = new Position2D(rx, ry);
        break;
      }

      attempt += 1;
    }

    return result;
  }
}