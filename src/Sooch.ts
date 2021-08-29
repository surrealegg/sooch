import { Sprite } from "@pixi/sprite";
import SoochList from "./Soochlist";
import { Tween, TweenManager } from "./Tween/Tween";
import { easeInOutBack, easeOut, easeOutCubic } from "./Tween/Easing";
import { SaveState } from "./SaveState";

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

  private saveState!: SaveState;
  private list!: SoochList;
  private health!: number;
  private sprite!: Sprite;
  private position!: Vector2;
  private tweenManager!: TweenManager;
  private options!: SoochOptions;
  private squash = false;

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
    this.saveState = options.saveState;

    this.options = options;

    // Create a sprite
    this.sprite = new Sprite(options.texture.sooch?.default);
    this.sprite.interactive = true;

    // Handle events
    this.sprite.on("mouseover", () => {
      options.game.view.style.cursor = "pointer";
    });
    this.sprite.on("mouseout", () => {
      options.game.view.style.cursor = "inherit";
    });
    this.sprite.on("mouseupoutside", () => {
      options.game.view.style.cursor = "inherit";
    });

    // Set inital position
    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 1;
    this.sprite.x = this.SOOCH_STARTING_POSITION;
    this.sprite.y = options.game.screen.height / 1.4;
    this.sprite.zIndex = 0;

    // Set references to parent classes
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
        to: { x: this.options.game.screen.width / 2 },
        duration: 150,
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
        onUpdate: (_data, progress) => {
          this.sprite.y += progress * 6;
          if (this.options.background) {
            this.options.background.tilePosition.y += progress / 2;
            if (this.options.background.tilePosition.y >= 641)
              this.options.background.tilePosition.y = 0;
          }
        },
      })
    );

    this.options.game.ticker.add(() => {
      this.tweenManager.update(this.options.game.ticker.lastTime);
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
    this.options.container.addChild(this.sprite);
  }

  /**
   * Removes the sprite to the screen
   */
  public removeChild(): void {
    this.options.container.removeChild(this.sprite);
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
  public onMouseDown(): void {
    if (this.tweenManager.isPlaying("enter") || this.health < 1) return;
    this.options.particle.add();
    this.health--;
    if (this.health > 0) {
      this.position.y += 5;
      this.sprite.y = this.position.y;
    }
    this.squash = true;
    this.options.piston.down();
    this.tweenManager.start("squash");
    this.saveState.addClick(1);
  }

  /**
   * Main function that draw the Sooch itself
   */
  public onMouseUp(): void {
    if (this.tweenManager.isPlaying("enter") || this.squash === false) return;
    this.options.piston.up();
    this.tweenManager.start("squash", true);
    this.squash = false;
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
