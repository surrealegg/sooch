import Sooch from './Sooch';
import {Application, Container} from 'pixi.js';
import Miner from './Miner';

/**
 * A class that stores list of Sooch
 */
export default class SoochList {
    readonly MAX_SOOCH_AMOUNT = 5;

    private list: Sooch[] = [];
    private container!: Container;
    private game!: Application;
    private miner!: Miner;

    /**
     *
     * @param {Container} container main container for the sooch
     * @param {Application} game main game class
     * @param {Miner} miner Miner class needed to trigger down and up functions
     */
    constructor(container: Container, game: Application, miner: Miner) {
      this.container = container;
      this.game = game;
      this.miner = miner;
    }

    /**
     * Spawns new sooch
     */
    public add(): void {
      this.list.forEach((sooch) => {
        sooch.goDown();
      });
      const sooch = new Sooch(this, this.container, this.game, this.miner);
      sooch.addChild();
      this.list.push(sooch);
      if (this.list.length > this.MAX_SOOCH_AMOUNT) {
        this.list[0].removeChild();
        this.list.shift();
      }
    }
};
