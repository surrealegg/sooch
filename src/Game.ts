import {update} from '@tweenjs/tween.js';
import {Application, Container} from 'pixi.js';
import Miner from './Miner';
import SoochList from './Soochlist';

const canvas = document.getElementById('game');
const game = new Application({
  view: canvas as HTMLCanvasElement,
  width: 1400,
  height: 750,
  backgroundColor: 0x212121,
});

const container = new Container;
container.sortableChildren = true;

const miner = new Miner(container, game);
const soochList = new SoochList(container, game, miner);
soochList.add();
miner.addChild();
game.stage.addChild(container);

// Make tween update.
game.ticker.add(() => {
  update();
});
