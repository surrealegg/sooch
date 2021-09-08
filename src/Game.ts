import { Application, Container, TilingSprite } from "pixi.js";
import { AchievementCompare, Achievements } from "./Achievements";
import { ParticleList } from "./ParticleList";
import Piston from "./Piston";
import { SaveState } from "./SaveState";
import SoochList from "./Soochlist";

export class Game {
  private saveState: SaveState = new SaveState();
  private achievements: Achievements = new Achievements();
  private piston!: Piston;
  private soochList!: SoochList;
  private game!: Application;
  private container: Container = new Container();
  private particleList!: ParticleList;
  private background: TilingSprite | null = null;

  constructor(sprites: SpriteResources) {
    const canvas = document.getElementById("game");
    if (!canvas) {
      console.error("#game is missing");
      return;
    }

    this.particleList = new ParticleList(sprites);
    this.game = new Application({
      view: canvas as HTMLCanvasElement,
      width: 700,
      height: 750,
    });

    this.container.sortableChildren = true;

    this.piston = new Piston({
      container: this.container,
      game: this.game,
      texture: sprites,
    });

    if (sprites.tile) {
      this.background = new TilingSprite(sprites.tile, 700, 750);
      this.background.tileScale.x = 1;
      this.background.tileScale.y = 1;
      this.background.position.x = 0;
      this.background.position.y = 0;
    }

    this.soochList = new SoochList({
      container: this.container,
      game: this.game,
      texture: sprites,
      piston: this.piston,
      particle: this.particleList,
      saveState: this.saveState,
      background: this.background,
    });

    this.container.interactive = true;
    this.container.on("pointerdown", () => this.soochList.down());
    this.container.on("pointerup", () => this.soochList.up());
    this.container.on("pointerupoutside", () => this.soochList.up());

    console.log(this.background);
    if (this.background) this.game.stage.addChild(this.background);
    this.soochList.add();
    this.piston.addChild();
    this.game.stage.addChild(this.container);

    // Add achievements
    // TO-DO: Complete the list.
    this.achievements.add("The beginning...", {
      description: "Get your first Sooch.",
      data: {
        clicks: { value: 1, check: AchievementCompare.GREAT_EQUAL },
      },
    });
    this.achievements.add("Stacking up!", {
      description: "Stack your first Sooch.",
      data: {
        count: { value: 1, check: AchievementCompare.GREAT_EQUAL },
      },
    });
    this.achievements.add("New Sooch!", {
      description: "Unlock a new type of Sooch.",
      data: {
        upgrades: [0],
      },
    });
  }
}
