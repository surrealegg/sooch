import { Sprite } from "@pixi/sprite";
import { Application, Container } from "pixi.js";
import { SoochOptions } from "../types";
import Miner from "./Piston";
import SoochList from "./Soochlist";
import { Tween, TweenManager } from "./Tween/Tween";
import { easeInOutBack, easeOut, easeOutCubic } from "./Tween/Easing";

type Vector2 = {
  x: number;
  y: number;
};

/**
 * The Sooch
 */
export default class Sooch {
  readonly SOOCH_UPDATE_FACTOR = 5;
  readonly SOOCH_STARTING_POSITION = -500;

  private list!: SoochList;
  private health!: number;
  private sprite!: Sprite;
  private container!: Container;
  private game!: Application;
  private miner!: Miner;
  private position!: Vector2;
  private tweenManager!: TweenManager;

  /**
   * Constructor for Sooch class
   *
   * @param {SoochList} list parent class to trigger to create a new one.
   * @param {SoochOptions} options options
   * @param {number} health the amount of hits sooch could have (default: 5)
   */
  constructor(list: SoochList, options: SoochOptions, health = 5) {
    this.health = health;
    this.position = {
      x: this.SOOCH_STARTING_POSITION,
      y: options.game.screen.height / 1.4,
    };

    this.tweenManager = new TweenManager();

    // Create a sprite
    this.sprite = new Sprite(options.texture);
    this.sprite.interactive = true;

    // Handle events
    this.sprite.on("mouseover", () => {
      options.game.view.style.cursor = "pointer";
    });
    this.sprite.on("mouseout", () => {
      options.game.view.style.cursor = "inherit";
    });
    this.sprite.on("mousedown", () => {
      this.onMouseDown();
    });
    this.sprite.on("mouseup", () => {
      this.onMouseUp();
    });
    this.sprite.on("mouseupoutside", () => {
      this.onMouseUp();
      options.game.view.style.cursor = "inherit";
    });

    // Set inital position
    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 1;
    this.sprite.x = this.SOOCH_STARTING_POSITION;
    this.sprite.y = options.game.screen.height / 1.4;
    this.sprite.zIndex = 0;

    // Set references to parent classes
    this.container = options.container;
    this.miner = options.miner;
    this.game = options.game;
    this.list = list;

    this.tweenManager.add(
      "squash",
      new Tween({
        from: { x: 1, y: 1 },
        to: { x: 1.2, y: 0.6 },
        duration: 100,
        ease: easeInOutBack,
        onUpdate: (data) => {
          this.sprite.scale.x = data.x;
          this.sprite.scale.y = data.y;
        },
      })
    );

    this.tweenManager.add(
      "enter",
      new Tween({
        from: { x: this.SOOCH_STARTING_POSITION },
        to: { x: this.game.screen.width / 2 },
        duration: 200,
        ease: easeOutCubic,
        onUpdate: (data) => (this.sprite.x = data.x),
      })
    );

    this.tweenManager.add(
      "down",
      new Tween({
        from: { y: 0 },
        to: { y: 1 },
        ease: easeOut,
        duration: 300,
        relative: true,
        onUpdate: (_data, progress) => (this.sprite.y += progress * 6),
      })
    );

    this.game.ticker.add(() => {
      this.tweenManager.update(this.game.ticker.lastTime);
    });
  }

  /**
   * Make sooch enter
   */
  public enter(): void {
    this.tweenManager.start("enter");
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
    this.tweenManager.start("down");
  }

  /**
   * Main function that draw the Sooch itself
   */
  private onMouseDown(): void {
    if (this.tweenManager.isPlaying("enter") || this.health < 1) return;
    this.health--;
    if (this.health > 0) {
      this.position.y += 5;
      this.sprite.y = this.position.y;
    }
    this.miner.down();
    this.tweenManager.start("squash");
  }

  /**
   * Main function that draw the Sooch itself
   */
  private onMouseUp(): void {
    if (this.tweenManager.isPlaying("enter")) return;
    this.miner.up();
    this.tweenManager.start("squash", true);
    if (this.health <= 0) {
      this.sprite.interactive = false;
      this.sprite.scale.x = 1;
      this.sprite.scale.y = 1;
      this.goDown();
      this.list.add();
      return;
    }
  }
}
