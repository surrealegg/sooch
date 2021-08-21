import {update} from '@tweenjs/tween.js';
import {Application, Container} from 'pixi.js';
import Sooch from './Sooch';
import Miner from './Miner';

const canvas = document.getElementById('game');
const game = new Application({
  view: canvas as HTMLCanvasElement,
  width: 1400,
  height: 750,
  backgroundColor: 0x212121,
});

const container = new Container;
const miner = new Miner(container, game);
const sooch = new Sooch(container, game, miner);
sooch.addChild();
miner.addChild();
game.stage.addChild(container);

// Make tween update.
game.ticker.add(() => {
  update();
});
