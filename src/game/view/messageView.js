  /**
     * The view for a MessageModel
     * @param {MessageModel} messageModel a MessageModel instance
     * @param {LevelModel}   levelModel   a LevelModel instance, used for dimensions
     * @param {Object}       context      a 2D drawing context
     */

import MessageModel from '../model/messageModel';
import LevelModel from '../model/levelModel';

export default class MessageView {
    constructor(messageModel, levelModel, context) {
    if(!(messageModel instanceof MessageModel)) {
      throw new TypeError("Invalid MessageModel instance");
    }

    if(!(levelModel instanceof LevelModel)) {
      throw new TypeError("Invalid LevelModel instance");
    }

    this.context  = context;
    this.modMsg   = messageModel;
    this.modLevel = levelModel;
  }

  /**
     * Called by the Application controller
     */
  render() {
    var w = (this.modLevel.width * this.modLevel.csize) + 1,
        h = (this.modLevel.height * this.modLevel.csize) + 33,
        cx = w / 2, 
        cy = h / 2;

    this.context.save();
    this.context.fillStyle = this.modMsg.overlay;
    this.context.fillRect(0, 0, w, h);
    this.context.shadowBlur   = this.modMsg.shadowBlur;
    this.context.shadowColor  = this.modMsg.shadowColor;
    this.context.font         = this.modMsg.font;
    this.context.fillStyle    = this.modMsg.color;    
    this.context.textAlign    = "center";
    this.context.textBaseline = "bottom";
    this.context.fillText(this.modMsg.message1, cx, cy);
    this.context.textBaseline = "top";
    this.context.fillText(this.modMsg.message2, cx, cy);
    this.context.restore();
  }
}