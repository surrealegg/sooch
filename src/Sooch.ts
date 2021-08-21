/* eslint-disable no-unused-vars */
import {Sprite} from '@pixi/sprite';
import {Application} from 'pixi.js';
import {GlitchFilter} from '@pixi/filter-glitch';

enum SoochState
{
    ENTER,
    IDLE,
    LEAVE
}

/**
 * The Sooch
 */
export default class Sooch {
    readonly SOOCH_SPRITE_PATH = '/assets/sprites/sooch.png';
    readonly SOOCH_UPDATE_FACTOR = 5;

    private health!: number;
    private hitTimer!: number;
    private sprite!: Sprite;
    private game!: Application;
    private timer!: number;
    private state!: SoochState;
    private glitchFilter!: GlitchFilter;

    /**
     * Constructor for Sooch class
     *
     * @param {Application} game main PIXI class
     * @param {number} health the amount of hits sooch could have (default: 5)
     */
    constructor(game: Application, health: number = 5) {
      this.health = health;
      this.timer = .0;
      this.hitTimer = 0;
      this.state = SoochState.ENTER;
      this.glitchFilter = new GlitchFilter();

      // Create a sprite
      this.sprite = Sprite.from(this.SOOCH_SPRITE_PATH);
      this.sprite.interactive = true;
      this.sprite.on('click', () => {
        this.hitTimer = 15;
      });
      this.sprite.anchor.set(.5);
      this.sprite.x = game.screen.width / 2;
      this.sprite.y = game.screen.height / 2;
      this.sprite.filters = [this.glitchFilter];

      // Set up the Game loop
      this.game = game;
      this.game.stage.addChild(this.sprite);
      this.game.ticker.add((dt) => {
        this.update(dt);
      });
    }

    /**
     * Main function that draw the Sooch itself
     *
     * @param {number} dt delta time
     */
    private update(dt: number): void {
      if (this.hitTimer > 0) {
        this.hitTimer -= dt;
      }
      this.timer += dt;
      if (this.timer >= this.SOOCH_UPDATE_FACTOR) {
        this.timer = 0;
        this.draw();
      }
    }

    /**
     * Main function that draw the Sooch itself
     *
     */
    private draw(): void {
      if (this.hitTimer > 0) {
        this.glitchFilter.refresh();
      }
    }
};
