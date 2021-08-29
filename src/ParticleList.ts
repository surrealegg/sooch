import { ParticleContainer } from "pixi.js";

export class ParticleList {
  private container = new ParticleContainer(10, {
    position: true,
    rotation: true,
  });
  private sprites!: SpriteResources;

  constructor(sprites: SpriteResources) {
    this.sprites = sprites;
  }

  add(): void {
    // TO-DO: Implement Particle system
    //this.container.addChild(new Sprite(this.sprites.sooch?.default));
  }
}
