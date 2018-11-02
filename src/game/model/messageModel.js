  /**
     * Holds data about a message overlay.
     * @param {String} message1 Message line 1
     * @param {String} message2 Message line 2
     */
export default class MessageModel {
    constructor(message1, message2) {
      this.message1       = message1;
      this.message2       = message2 || "Press any key to restart.";
      this.color          = "#ffffff";
      this.overlay        = "rgba(0, 0, 0, 0.7)";
      this.shadowBlur     = 10;
      this.shadowColor    = "rgba(0, 0, 0, 0.9)";
      this.font           = window.FONTS.messages.toString();
    }
}