import {Application} from 'pixi.js';
import Sooch from './Sooch';

const canvas = document.getElementById('game');
const game = new Application({
  view: canvas as HTMLCanvasElement,
  width: 1400,
  height: 750,
  backgroundColor: 0x212121,
});

new Sooch(game);
