/**
     * A simple wrapper for Canvas
     * @param {String} elementId HTML Element ID
     */

import Size2D from '../model/size2D';

export default class Canvas {
    constructor(elementId) {
    this.element = document.getElementById(elementId);
    this.context = this.element.getContext('2d');
  }

  /**
     * Get the size of the canvas element.
     * @returns {Size2D} returns a Size2D model. 
     */
  getSize() {
    return new Size2D(+this.element.width, +this.element.height);
  }

  /**
     * Set the size of the canvas element.
     * @param {Size2D} size a Size2D instance
     */
  setSize(size) {
    if(!(size instanceof Size2D)) {
      throw new TypeError("Invalid Size2D instance");
    }

    this.element.width = this.context.canvas.width = size.width;
    this.element.height = this.context.canvas.height = size.height;
  }

  /**
     * Clear the canvas completely by either removing all color information from its buffer or
     * by drawing an overlay to create a fade effect. 
     * @param {Number} fadeOpacity the opacity for the fade layer. Leave empty for full clear.
     */
  clear(fadeOpacity) {
    var size = this.getSize();
    if(typeof fadeOpacity === "number") {
      this.context.fillStyle = 'rgba(0, 0, 0, ' + fadeOpacity + ')';
      this.context.fillRect(0, 0, size.width, size.height);
    } else {
      this.context.clearRect(0, 0, size.width, size.height);
    }
  }
}