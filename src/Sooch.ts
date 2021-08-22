import {Sprite} from '@pixi/sprite';
import {Easing, Tween} from '@tweenjs/tween.js';
import {Application, Container} from 'pixi.js';
import Miner from './Miner';
import SoochList from './Soochlist';

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
    readonly SOOCH_STARTING_POSITION = -500;

    private scale: Vector2 = {x: 1, y: 1};
    private list!: SoochList;
    private health!: number;
    private sprite!: Sprite;
    private container!: Container;
    private miner!: Miner;
    private position!: Vector2;
    private squashAnimation!: Tween<Vector2>;
    private returnAnimation!: Tween<Vector2>;
    private enterAnimation!: Tween<Vector2>;

    /**
     * Constructor for Sooch class
     *
     * @param {SoochList} list parent class to trigger to create a new one.
     * @param {Container} container Main container.
     * @param {Application} game Main PIXI class.
     * @param {Miner} miner Miner class needed to trigger down and up functions
     * @param {number} health the amount of hits sooch could have (default: 5)
     */
    constructor(
        list: SoochList,
        container: Container,
        game: Application,
        miner: Miner,
        health: number = 5) {
      this.health = health;
      this.position = {
        x: this.SOOCH_STARTING_POSITION,
        y: game.screen.height / 1.4,
      };
      this.returnAnimation = new Tween(this.scale)
          .to({x: 1, y: 1}, 150)
          .easing(Easing.Back.InOut)
          .onUpdate(() => {
            this.sprite.scale.x = this.scale.x;
            this.sprite.scale.y = this.scale.y;
          });
      this.squashAnimation = new Tween(this.scale)
          .to({x: 1.2, y: .6}, 50)
          .easing(Easing.Back.Out)
          .onUpdate(() => {
            this.sprite.scale.x = this.scale.x;
            this.sprite.scale.y = this.scale.y;
          });

      // Create a sprite
      this.sprite = Sprite.from(this.SOOCH_SPRITE_PATH);
      this.sprite.interactive = true;

      // Handle events
      this.sprite.on('mouseover', () => {
        game.view.style.cursor = 'pointer';
      });
      this.sprite.on('mouseout', () => {
        game.view.style.cursor = 'inherit';
      });
      this.sprite.on('mousedown', () => {
        this.onMouseDown();
      });
      this.sprite.on('mouseup', () => {
        this.onMouseUp();
      });
      this.sprite.on('mouseupoutside', () => {
        this.onMouseUp();
        game.view.style.cursor = 'inherit';
      });

      // Set inital position
      this.sprite.anchor.x = .5;
      this.sprite.anchor.y = 1;
      this.sprite.x = this.SOOCH_STARTING_POSITION;
      this.sprite.y = game.screen.height / 1.4;
      this.sprite.zIndex = 0;

      // Set references to parent classes
      this.container = container;
      this.miner = miner;
      this.list = list;

      // Temporary animation, will change later.
      this.enterAnimation = new Tween(this.position)
          .delay(100)
          .to({x: game.screen.width / 2, y: game.screen.height / 1.4}, 200)
          .easing(Easing.Cubic.Out)
          .onUpdate(() => {
            this.sprite.position.x = this.position.x;
            this.sprite.position.y = this.position.y;
          }).start();
    }

    /**
     * Adds the sprite to the screen
     */
    public addChild(): void {
      this.container.addChild(this.sprite);
    }

    /**
     * Removes the sprite to the screen
     */
    public removeChild(): void {
      this.container.removeChild(this.sprite);
    }

    /**
     * Make Sooch to go down. There's a callback that will be used,
     * to destroy itself if it's out of bounds.
     * having a member Tween won't work, needs changes in the future.
     *
     * @param {OnFinishCallback} onFinish
     */
    public goDown(): void {
      new Tween(this.position)
          .to({x: 0, y: '+80'}, 300)
          .easing(Easing.Quadratic.Out)
          .onUpdate(() => {
            this.sprite.position.y = this.position.y;
          }).start();
    }

    /**
     * Main function that draw the Sooch itself
     *
     */
    private onMouseDown(): void {
      if (this.squashAnimation.isPlaying() || this.health < 1) {
        return;
      }
      this.health--;
      this.position.y += 20;
      this.sprite.y = this.position.y;
      this.miner.down();
      this.returnAnimation.stop();
      this.squashAnimation.start();
    }

    /**
     * Main function that draw the Sooch itself
     * FIXME: The movements are somehow inconsistent.
     *
     */
    private onMouseUp(): void {
      if (this.returnAnimation.isPlaying()) {
        return;
      }
      this.miner.up();
      if (this.health <= 0) {
        this.sprite.interactive = false;
        this.enterAnimation.stop();
        this.squashAnimation.stop();
        this.returnAnimation.stop();
        this.sprite.scale.x = 1;
        this.sprite.scale.y = 1;
        this.goDown();
        this.list.add();
        return;
      }
      this.squashAnimation.stop();
      this.returnAnimation.start();
    }
};
