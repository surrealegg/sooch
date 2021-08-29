import { Sprite } from "@pixi/sprite";
import { Container } from "pixi.js";
import { Sound } from "@pixi/sound";
import { Tween, TweenManager } from "./Tween/Tween";
import { easeInExpo, easeOutExpo } from "./Tween/Easing";

/**
 * Sooch piston
 */
export default class Piston {
  readonly PISTON_INITAL_Y_POSITION = -300;

  private container!: Container;
  private sprite!: Sprite;
  private tweenManager!: TweenManager;
  private shakeTimeout!: number;
  private sounds!: Sound[];

  /**
   * Piston constructor
   *
   * @param {MainOptions} options options for Piston class
   */
  constructor(options: MainOptions) {
    this.shakeTimeout = 0;
    this.sprite = new Sprite(options.texture.piston);
    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 0;
    this.sprite.x = options.game.screen.width / 2;
    this.sprite.y = this.PISTON_INITAL_Y_POSITION;
    this.sprite.zIndex = 1;

    this.sounds = [
      Sound.from({
        url: "/assets/audio/smash_1.wav",
        preload: true,
        volume: 0.5,
      }),
      Sound.from({
        url: "/assets/audio/smash_2.wav",
        preload: true,
        volume: 0.5,
      }),
      Sound.from({
        url: "/assets/audio/smash_3.wav",
        preload: true,
        volume: 0.5,
      }),
      Sound.from({
        url: "/assets/audio/smash_4.wav",
        preload: true,
        volume: 0.5,
      }),
    ];

    const sliderVolume = document.getElementById(
      "volume-slider"
    ) as HTMLInputElement;
    sliderVolume.addEventListener("input", () =>
      this.changeVolume(sliderVolume.value)
    );
    const savedValue = localStorage.getItem("volume");
    if (savedValue) {
      sliderVolume.value = savedValue;
      this.changeVolume(savedValue);
    }

    // Set Animations
    this.tweenManager = new TweenManager();
    this.tweenManager.add(
      "enter",
      new Tween({
        from: { y: this.PISTON_INITAL_Y_POSITION },
        to: { y: this.PISTON_INITAL_Y_POSITION + 250 },
        duration: 50,
        ease: easeOutExpo,
        onUpdate: (data) => (this.sprite.y = data.y),
        onStart: () => (this.shakeTimeout = 10),
      })
    );
    this.tweenManager.add(
      "leave",
      new Tween({
        from: { y: this.PISTON_INITAL_Y_POSITION + 250 },
        to: { y: this.PISTON_INITAL_Y_POSITION },
        duration: 100,
        onUpdate: (data) => (this.sprite.y = data.y),
        ease: easeInExpo,
      })
    );

    // Make the screen shake if it set a timer to do so.
    options.game.ticker.add((dt) => {
      this.tweenManager.update(options.game.ticker.lastTime);
      if (this.shakeTimeout > 0) {
        this.shakeTimeout -= dt;
        if (this.shakeTimeout <= 0) {
          this.container.x = 0;
          this.container.y = 0;
        } else {
          this.container.x = 6 * (Math.random() > 0.5 ? 1 : -1);
          this.container.y = 6 * (Math.random() > 0.5 ? 1 : -1);
        }
      }
    });

    // Set container reference
    this.container = options.container;
  }

  private changeVolume(volume: string): void {
    localStorage.setItem("volume", volume);
    this.sounds.forEach((sound) => (sound.volume = parseInt(volume) / 100));
  }

  /**
   * Adds the sprite to the container
   */
  public addChild(): void {
    this.container.addChild(this.sprite);
  }

  /**
   * A function that triggers the piston to go down
   */
  public down(): void {
    this.tweenManager.start("enter");
    this.sounds[Math.floor(Math.random() * this.sounds.length)].play();
  }

  /**
   * A function that triggers the piston to go up
   */
  public up(): void {
    this.tweenManager.start("leave");
  }
}
