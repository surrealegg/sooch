/* eslint-disable no-unused-vars */
import {Sprite} from '@pixi/sprite';
import {Easing, Tween} from '@tweenjs/tween.js';
import {Application, Container} from 'pixi.js';
import Miner from './Miner';

enum SoochState
{
    ENTER,
    IDLE,
    LEAVE
}

type Vector2 = {
  x: number,
  y: number
};

/**
 * The Sooch
 */
export default class Sooch {
    readonly SOOCH_SPRITE_PATH = '/assets/sprites/sooch.png';
    readonly SOOCH_UPDATE_FACTOR = 5;

    private health!: number;
    private sprite!: Sprite;
    private container!: Container;
    private state!: SoochState;
    private scale!: Vector2;
    private position!: Vector2;
    private squashAnimation!: Tween<Vector2>;
    private returnAnimation!: Tween<Vector2>;

    /**
     * Constructor for Sooch class
     *
     * @param {Container} container Main container.
     * @param {Application} game Main PIXI class.
     * @param {Miner} miner Miner class needed to trigger down and up functions
     * @param {number} health the amount of hits sooch could have (default: 5)
     */
    constructor(
        container: Container,
        game: Application, miner: Miner, health: number = 5) {
      this.health = health;
      this.state = SoochState.ENTER;

      this.scale = {x: 1, y: 1};
      this.position = {x: -500, y: game.screen.height / 1.4};

      this.returnAnimation = new Tween(this.scale)
          .to({x: 1, y: 1}, 150)
          .delay(500)
          .easing(Easing.Back.InOut)
          .onUpdate(() => {
            this.sprite.scale.x = this.scale.x;
            this.sprite.scale.y = this.scale.y;
          });
      this.squashAnimation = new Tween(this.scale)
          .to({x: 1.2, y: .6}, 50)
          .easing(Easing.Quintic.Out)
          .onUpdate(() => {
            this.sprite.scale.x = this.scale.x;
            this.sprite.scale.y = this.scale.y;
          });

      // Create a sprite
      this.sprite = Sprite.from(this.SOOCH_SPRITE_PATH);
      this.sprite.interactive = true;

      // Handle events
      this.sprite.on('mousedown', () => {
        this.onMouseDown();
        miner.down();
      });
      this.sprite.on('mouseup', () => {
        this.onMouseUp();
        miner.up();
      });
      this.sprite.on('mouseupoutside', () => {
        this.onMouseUp();
        miner.up();
      });

      // Set inital position
      this.sprite.anchor.x = .5;
      this.sprite.anchor.y = 1;
      this.sprite.x = game.screen.width / 2;
      this.sprite.y = game.screen.height / 1.4;

      // Set references to parent classes
      this.container = container;

      // Temporary animation, will change later.
      new Tween(this.position)
          .delay(100)
          .to({x: game.screen.width / 2, y: game.screen.height / 1.4})
          .easing(Easing.Quartic.Out)
          .onUpdate(() => {
            this.sprite.position.x = this.position.x;
            this.sprite.position.y = this.position.y;
          }).start();
    }

    /**
     * Adds the sprite to the screen
     */
    public addChild() {
      this.container.addChild(this.sprite);
    }

    /**
     * Main function that draw the Sooch itself
     *
     */
    private onMouseDown(): void {
      if (this.squashAnimation.isPlaying()) {
        return;
      }
      this.returnAnimation.stop();
      this.squashAnimation.start();
    }

    /**
     * Main function that draw the Sooch itself
     *
     */
    private onMouseUp(): void {
      if (this.returnAnimation.isPlaying()) {
        return;
      }
      this.squashAnimation.stop();
      this.returnAnimation.start();
    }
};
