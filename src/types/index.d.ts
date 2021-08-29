import {
  Application,
  Container,
  Resource,
  Texture,
  TilingSprite,
} from "pixi.js";
import { ParticleList } from "../ParticleList";
import Piston from "../Piston";
import { SaveState } from "../SaveState";

type Sprite = Texture<Resource>;

declare global {
  interface AchievementCheckType<Type> {
    value: Type;
    check: AchievementCompare;
  }

  interface AchievementCheck {
    count?: AchievementCheckType<number>;
    soochPerSecond?: AchievementCheckType<number>;
    clicks?: AchievementCheckType<number>;
    ascend?: AchievementCheckType<number>;
    helpers?: { [id: number]: number };
    upgrades?: number[];
    createdAt?: AchievementCheckType<number>;
  }

  interface Achievement {
    description: string;
    quote?: string;
    data: AchievementCheck;
  }

  interface MainOptions {
    container: Container;
    game: Application;
    texture: SpriteResources;
  }

  interface SoochOptions extends MainOptions {
    piston: Piston;
    particle: ParticleList;
    saveState: SaveState;
    background: TilingSprite | null;
  }

  interface SaveFormat {
    count: number;
    soochPerSecond: number;
    clicks: number;
    ascend: number;
    helpers: { [id: number]: number };
    achievements: string[];
    upgrades: number[];
    createdAt: number;
    updatedAt: number;
  }

  interface SpriteResources {
    sooch?: {
      default?: Sprite;
      bronze?: Sprite;
      silver?: Sprite;
      invert?: Sprite;
      golden?: Sprite;
      lava?: Sprite;
    };
    piston?: Sprite;
    tile?: Sprite;
  }
}
