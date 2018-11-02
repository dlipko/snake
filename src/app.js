import css from './css/style.css';

import Application from './game/application.js';
import Font from './game/utils/font';
import generateLevel from './game/utils/generateLevel';

import setRequestAnimationFrame from './game/utils/setRequestAnimationFrame';

(function(root){
     // keys and directions
  root.KEY_UP    = root.DIR_UP    = 38;
  root.KEY_DOWN  = root.DIR_DOWN  = 40;
  root.KEY_LEFT  = root.DIR_LEFT  = 37;
  root.KEY_RIGHT = root.DIR_RIGHT = 39;
  root.DIR_INV   = {}; // inverse
  root.DIR_INV[root.DIR_UP]     = root.DIR_DOWN;
  root.DIR_INV[root.DIR_DOWN]   = root.DIR_UP;
  root.DIR_INV[root.DIR_RIGHT]  = root.DIR_LEFT;
  root.DIR_INV[root.DIR_LEFT]   = root.DIR_RIGHT;

// data
  root.FONTS = {
    score: new Font("Press Start 2P", 10),
    messages: new Font("Press Start 2P", 14)
  };



  root.LEVELS = [];

  // WTF??????????????
  var levelWidth = 30, levelHeight = 30;

  window.LEVELS.push(generateLevel(levelWidth, levelHeight, 5, 1));
  window.LEVELS.push(generateLevel(levelWidth, levelHeight, 5, 2));
  window.LEVELS.push(generateLevel(levelWidth, levelHeight, 2, 2));
  window.LEVELS.push(generateLevel(levelWidth, levelHeight, 1, 2));


  // music

  var rootPath = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/188512/",
      extension = "mp3";

  root.MUSIC_FILES = [
    rootPath + "music1." + extension,
    rootPath + "music2." + extension,
    rootPath + "music3." + extension,
    rootPath + "music4." + extension,
    rootPath + "music5." + extension
  ];

}(window));


// set request animation frame
setRequestAnimationFrame();


  // main.js just fires up the application
  window.addEventListener('load', function() {
    window.ctrApplication = new Application();
  });
