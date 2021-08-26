import {
  Application,
  Container,
  Resource,
  Texture,
} from "pixi.js";
import Miner from "../src/Piston";

declare interface MainOptions {
  container: Container;
  game: Application;
  texture: Texture<Resource>;
}

declare interface SoochOptions extends MainOptions {
  miner: Miner;
}
