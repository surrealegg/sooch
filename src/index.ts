import * as PIXI from 'pixi.js';

const canvas = document.getElementById('game');
const game = new PIXI.Application({
  view: canvas as HTMLCanvasElement,
  width: 256,
  height: 256,
  backgroundColor: 0x212121,
});

const text = new PIXI.Text('Sooch time!', {
  fill: ['#fff'],
});
text.x = 20;
text.y = 20;

game.stage.addChild(text);
