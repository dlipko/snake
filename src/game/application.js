import FoodModel from './model/foodModel';
import KeyboardModel from './model/keyboardModel';
import LevelModel from './model/levelModel';
import MessageModel from './model/messageModel';
import Position2D from './model/position2D';
import Size2D from './model/size2D';
import SnakeModel from './model/snakeModel';
import SnakeSegmentModel from './model/snakeSegmentModel';

import Canvas from './utils/canvas';
import Sound from './utils/sound';

// controllers
import KeyboardController from './controller/keyboardController';
import LevelController from './controller/levelController';
import SnakeController from './controller/snakeController';

// view
import FoodTimerView from './view/foodTimerView';
import LevelView from './view/levelView';
import MessageView from './view/messageView';
import ScoreView from './view/scoreView';
import SnakeView from './view/snakeView';

import generateLevel from './utils/generateLevel';

/**
     * The main controller for this application.
     * A.K.A. The Game State Controller! :) 
     */
export default class Application {
    constructor() {
      const canvas  = new Canvas("render-target");

      this.modKeyboard = new KeyboardModel();
      this.ctrKeyboard = new KeyboardController(this.modKeyboard);

      // cancel regular behaviour
      this.modKeyboard.blockedKeys[KEY_DOWN]  = true;
      this.modKeyboard.blockedKeys[KEY_UP]    = true;
      this.modKeyboard.blockedKeys[KEY_RIGHT] = true;
      this.modKeyboard.blockedKeys[KEY_LEFT]  = true;


      // this will be our render target
      this.renderTarget = canvas;


      const rootPath = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/188512/",
            extension = "mp3";

      const SOUND_FILES = {
        pickup: {src: rootPath + "pickup." + extension, volume: 1},
        death:  {src: rootPath + "death." + extension, volume: 1},
        thump:  {src: rootPath + "thump." + extension, volume: 0.3}
      };


      // configure all the sounds, these sounds will be played on certain events.
      this.sounds = {};
      for(let i in SOUND_FILES) {
        if(SOUND_FILES.hasOwnProperty(i)) {
          this.sounds[i] = new Sound(SOUND_FILES[i].src, SOUND_FILES[i].volume);
        }
      }

      // initialize the remaining models and start the gameloop.
      this.init();
  }

  init() {
    var i, 
        that = this,

        // create the snake model, the controller will position it later. Level needs this!
        modSnake = new SnakeModel(new Position2D(0, 0)), 


        modLevel = generateLevel(30, 30, 3 + Math.floor(Math.random() * 5), true),
        modFood  = new FoodModel(), // generate empty food model
        ctrLevel = new LevelController(modLevel, modFood, modSnake), // create the level controller based on two models
        disLevel = new LevelView(modLevel, this.renderTarget.context), // create the level view, based on a model and a drawing context

        ctrSnake = new SnakeController(modSnake, modLevel, this.ctrKeyboard), // create snake ccontroller based on snake model, level model and keyboard controller
        disSnake = new SnakeView(modSnake, modLevel, this.renderTarget.context), // create the snake view, based on the snake model, level model and drawing context

        // simple score view
        disScore = new ScoreView(modSnake, modLevel, this.renderTarget.context),

        // and a simple food timer view
        disFoodTimer = new FoodTimerView(modFood, modLevel, this.renderTarget.context);

    this.modLevel    = modLevel;
    this.controllers = [];
    this.models      = [];
    this.views       = [];
    this.waitKey     = false;
    this.paused      = false;
    this.cancel      = false;
    this.starting    = true;

    // stop all sounds and make sure the snake model knows about them
    modSnake.sounds = this.sounds;
    for(i in this.sounds) {
      if(this.sounds.hasOwnProperty(i)) {
        this.sounds[i].stop();
      }
    }

    // some message models and views
    this.winOrDieMessage     = new MessageModel("You die!");
    this.winOrDieMessageView = new MessageView(this.winOrDieMessage, modLevel, this.renderTarget.context);
    this.pausedMessage       = new MessageModel("Start Game.", "Press any key to start.");
    this.pausedMessageView   = new MessageView(this.pausedMessage, modLevel, this.renderTarget.context);

    // if a track is playing, stop it.
    if(this.modAudio) {
      this.modAudio.pause();
    }

    // load the game music and start playing when it can be played.
    this.modAudio = new Audio();
    this.modAudio.src = MUSIC_FILES[Math.floor(Math.random() * MUSIC_FILES.length)];
    this.modAudio.loop = true;
    this.modAudio.volume = 0.4;
    this.modAudio.addEventListener('canplay', function() {
      this.play();
    });

    // push all models, views and controllers to the main controller. 
    this.pushAll(this.modKeyboard, undefined, this.ctrKeyboard);
    this.pushAll(modLevel, disLevel, ctrLevel);
    this.pushAll(modSnake, disSnake, ctrSnake);
    this.views.push(disScore);
    this.views.push(disFoodTimer);

    // resize the canvas to be able to fit the grid!
    this.renderTarget.setSize(new Size2D(modLevel.csize * modLevel.width + 1, modLevel.csize * modLevel.height + 33));

    // signal the gameloop to stop
    this.endLoop();

    // wait for a little over 1 frame at 60 FPS before we start the loop 
    setTimeout(function() {
      that.beginLoop();
    }, 20);
  }

  /**
     * Push all the MVC components at once, if required.
     * @param {Object} model      a model / data representation
     * @param {Object} view       a view / output of a model
     * @param {Object} controller the controller
     */
  pushAll(model, view, controller) {
    if(typeof model === "object") {
      this.models.push(model);
    }

    if(typeof view  === "object") {
      this.views.push(view);
    }

    if(typeof controller === "object") {
      this.controllers.push(controller);
    }
  }

  /**
     * Start the gameloop.
     */
  beginLoop() {
    var that = this, time;

    this.cancel = false;
    this.renderTarget.clear(1);
    (function gameLoop() {
      var i;

      if(!that.waitKey && !that.paused) {
        // if the game just started, pause it to prevent instant death because the player is not paying attention...
        if(that.starting) {
          that.starting = false;
          that.paused = that.waitKey = true;
          time = Date.now();
        }
        // update all the controllers before rendering anything.
        for(i in that.controllers) {
          if(that.controllers.hasOwnProperty(i)) {
            that.controllers[i].update();

            // if the controller is a snake, check if it is destroyed yet...
            if(that.controllers[i] instanceof SnakeController) {
              if(that.controllers[i].isDestroyed()) {
                if(that.controllers[i].modSnake.cause === "obesity") {
                  that.winOrDieMessage.message1 = "You win, you ate all the food and died by obesity!";
                } else {
                  that.winOrDieMessage.message1 = "You die, you touched " + (that.controllers[i].modSnake.cause === "snake" ? "the tail" : "a wall") + "!";
                }
                that.waitKey = true;
                that.modAudio.pause();
                time = Date.now();
              }
            }
          }
        }

        // if the loop shouldn't wait for a key, and P was pressed, pause the game.
        if(!that.waitKey && that.ctrKeyboard.isKeyDown(80)) {
          that.paused = that.waitKey = true;
          that.modAudio.pause();
          time = Date.now();

          that.pausedMessage.message1 = "Paused.";
          that.pausedMessage.message2 = "Press any key to continue.";

          that.modLevel.food.age = (Date.now() - that.modLevel.food.birth);
        }

        // clear the rendering target
        that.renderTarget.clear(0.5);

        // render all the views.
        for(i in that.views) {
          if(that.views.hasOwnProperty(i)) {
            that.views[i].render();
          }
        }

        // if we need to wait for a key, we first need to render the notification that tells the player to press one. 
        if(that.waitKey) {
          if(that.paused) {
            that.pausedMessageView.render();
          } else {
            that.winOrDieMessageView.render();
          }
        }
      } else {
        // wait for any keypress, debounce at 500ms 
        if(that.ctrKeyboard.hasAnyKeyDown() && Date.now() - time > 500) {
          if(that.paused) {
            // resume game logic
            that.paused = that.waitKey = false;
            that.modAudio.play();

            // debounce all keys.
            that.ctrKeyboard.model.pressedKeys = {};

            // restore the food age
            that.modLevel.food.birth = (Date.now() - that.modLevel.food.age);
          } else {
            // restart game, player died and pressed a key
            that.init();
          }
        }
      }


      // request the next frame 
      if(!that.cancel) {
        // request the next animation frame 
        that.frame = requestAnimationFrame(gameLoop);
      }
    }());
  }

  /**
     * End the gameloop
     */
  endLoop() {
    this.cancel = true;
  }

}