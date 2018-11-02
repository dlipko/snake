/**
     * The KeyboardController class is used to monitor keypresses and make them accesible 
     * at all times, via the KeyboardModel. 
     * @param {KeyboardModel} model an instance of KeyboardModel, to store the data.
     */

import KeyboardModel from '../model/keyboardModel';

export default class KeyboardController {
    constructor(model) {
    if(!(model instanceof KeyboardModel)) {
      throw new TypeError("Invalid model instance");
    }
    this.model   = model;
    this.started = false;
    this.start();
  }

  /**
     * Attaches the event handlers to the window object.
     */
  start() {
    if(this.started) {
      return true;
    }

    var that = this;
    window.addEventListener('keydown', function(event) {
      that.model.pressedKeys[event.keyCode || event.which] = true;

      that.model.modifiers.control = !!event.ctrlKey;
      that.model.modifiers.alt     = !!event.altKey;
      that.model.modifiers.shift   = !!event.shiftKey;

      event.preventDefault();
      return false;
    });

    window.addEventListener('keyup', function(event) {
      that.model.pressedKeys[event.keyCode || event.which] = false;

      that.model.modifiers.control = !!event.ctrlKey;
      that.model.modifiers.alt     = !!event.altKey;
      that.model.modifiers.shift   = !!event.shiftKey;

      event.preventDefault();
      return false;
    });

    window.addEventListener('keypress', function(event) {
      if(that.model.blockedKeys[event.keyCode || event.which]) {
        console.log("blocked");
        event.preventDefault();
        return false;
      }
    });

    this.started = true;
  }

  /**
     * Gets called from the main application gameloop.
     */
  update() { 
    // nothing special is being updated through this controller
    return undefined;
  }

  /**
     * Determine if there is any key being pressed at this moment (support for "Press any key to...")
     * @returns {Boolean} when a key is currently down, returns true.
     */
  hasAnyKeyDown() {
    var i;
    for(i in this.model.pressedKeys) {
      if(this.model.pressedKeys.hasOwnProperty(i)) {
        if(this.model.pressedKeys[i]) {
          return true;
        }
      }
    }

    return false;
  }

  /**
     * Can be used to determine if a key is currently being pressed or not.
     * @param   {Number}  keyCode the keycode to check for, e.g. 13 for return.
     * @returns {Boolean} true when the key is down, false if the key is up (or when it does not exist).
     */
  isKeyDown(keyCode) {
    return !!this.model.pressedKeys[keyCode];
  }
}