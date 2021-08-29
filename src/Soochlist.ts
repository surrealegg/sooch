import Sooch from "./Sooch";

/**
 * A class that stores list of Sooch
 */
export default class SoochList {
  readonly MAX_SOOCH_AMOUNT = 6;

  private list: Sooch[] = [];
  private options!: SoochOptions;

  /**
   * Sooch list constructor
   *
   * @param {SoochOptions} options options
   */
  constructor(options: SoochOptions) {
    this.options = options;
  }

  /**
   * Spawns new sooch
   */
  public async add(): Promise<void> {
    this.list.forEach((sooch) => {
      sooch.goDown();
    });
    const sooch = new Sooch(this, this.options);
    sooch.addChild();
    sooch.enter();
    this.list.push(sooch);
    if (this.list.length > this.MAX_SOOCH_AMOUNT) {
      this.list[0].removeChild();
      this.list.shift();
    }
  }

  public down(): void {
    if (this.list.length > 0) this.list[this.list.length - 1].onMouseDown();
  }

  public up(): void {
    if (this.list.length > 0) this.list[this.list.length - 1].onMouseUp();
  }
}
