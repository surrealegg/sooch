import { Application, Container, Loader, Resource, Texture } from "pixi.js";
import Piston from "./Piston";
import SoochList from "./Soochlist";

const loader = new Loader();
const sprites: {
  sooch?: Texture<Resource>;
  piston?: Texture<Resource>;
} = {};
loader.add("sooch", "/assets/sprites/sooch.png");
loader.add("piston", "/assets/sprites/piston.png");
loader.load((_loader, resources) => {
  sprites.sooch = resources.sooch.texture;
  sprites.piston = resources.piston.texture;

  const canvas = document.getElementById("game");
  const game = new Application({
    view: canvas as HTMLCanvasElement,
    width: 1400,
    height: 750,
    backgroundColor: 0x212121,
  });

  const container = new Container();
  container.sortableChildren = true;
  const miner = new Piston({
    container: container,
    game: game,
    texture: resources.piston.texture as Texture<Resource>,
  });
  const soochList = new SoochList({
    container: container,
    game: game,
    texture: resources.sooch.texture as Texture<Resource>,
    miner: miner,
  });
  soochList.add();
  miner.addChild();
  game.stage.addChild(container);
});
