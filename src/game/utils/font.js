export default class Font {
  constructor(name, size) {
    this.size   = size || 12;
    this.name   = name;
    this.weight = "normal";
  }

  toString() {
    return this.weight + ' ' + this.size + "px '" + this.name + "'";
  }
}