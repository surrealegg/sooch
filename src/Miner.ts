import {Sprite} from '@pixi/sprite';
import {Application, Container} from 'pixi.js';
import {Easing, Tween} from '@tweenjs/tween.js';

type YPosition = {
    y: number
};

/**
 * Sooch crusher
 */
export default class Miner {
    readonly MINER_SPRITE_PATH = '/assets/sprites/miner.png';
    readonly MINER_INITAL_Y_POSITION = -300;

    private container!: Container;
    private sprite!: Sprite;
    private position!: YPosition;
    private smashEnter!: Tween<YPosition>;
    private smashLeave!: Tween<YPosition>;
    private shakeTimeout!: number;

    /**
     * Miner constructor
     *
     * @param {Container} container container
     * @param {Application} game main PIXI class
     */
    constructor(container: Container, game: Application) {
      this.shakeTimeout = 0;
      this.sprite = Sprite.from(this.MINER_SPRITE_PATH);
      this.sprite.anchor.x = .5;
      this.sprite.anchor.y = 0;
      this.sprite.x = game.screen.width / 2;
      this.sprite.y = this.MINER_INITAL_Y_POSITION;
      this.sprite.interactive = true;
      this.position = {y: this.MINER_INITAL_Y_POSITION};

      // Set Animations
      this.smashEnter = new Tween(this.position)
          .to({y: -30}, 50)
          .easing(Easing.Quintic.In)
          .onUpdate(() => {
            this.sprite.y = this.position.y;
          }).onStart(() => {
            this.shakeTimeout = 10;
          });
      this.smashLeave = new Tween(this.position)
          .to({y: this.MINER_INITAL_Y_POSITION}, 50)
          .easing(Easing.Quintic.Out)
          .onUpdate(() => {
            this.sprite.y = this.position.y;
          });

      // Make the screen shake if it set a timer to do so.
      game.ticker.add((dt) => {
        if (this.shakeTimeout > 0) {
          this.shakeTimeout -= dt;
          if (this.shakeTimeout <= 0) {
            this.container.x = 0;
            this.container.y = 0;
          } else {
            this.container.x = 6 * ((Math.random() > .5) ? 1 : -1);
            this.container.y = 6 * ((Math.random() > .5) ? 1 : -1);
          }
        }
      });

      // Set container reference
      this.container = container;
    }

    /**
     * Adds the sprite to the container
     */
    public addChild() {
      this.container.addChild(this.sprite);
    }

    /**
     * A function that triggers the piston to go down
     */
    public down(): void {
      this.smashLeave.stop();
      this.smashEnter.start();
    }

    /**
       * A function that triggers the piston to go up
       */
    public up(): void {
      this.smashEnter.stop();
      this.smashLeave.start();
    }
};
