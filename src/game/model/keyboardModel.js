/***********************************************************************
     * Holds information about key states, updated by KeyboardController.
  ************************************************************************/
  
export default class KeyboardModel {
	constructor() {
	    this.pressedKeys = {};
	    this.blockedKeys = {};
	    this.modifiers = {
	      control: false,
	      alt: false,
	      shift: false
	    };
  	}

}