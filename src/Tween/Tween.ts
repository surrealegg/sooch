type TweenType = { [name: string]: number };
type TweenConfig = {
  from: TweenType;
  to: TweenType;
  duration: number;
  relative?: boolean;
  ease: (progress: number) => number;
  onUpdate?: (data: TweenType, progress: number) => void;
  onFinish?: () => void;
  onStart?: () => void;
};

/**
 *  Main class to store multiple tweens by name
 */
export class TweenManager {
  private list: { [name: string]: Tween } = {};
  private current?: Tween;

  public add(name: string, tween: Tween): void {
    this.list[name] = tween;
  }

  public start(name: string, rerverse = false): void {
    if (name in this.list) {
      this.current = this.list[name];
      this.current.start(rerverse);
    }
  }

  public isPlaying(name: string): boolean {
    return name in this.list && this.list[name].isPlaying();
  }

  public update(currentTime: number): void {
    if (this.current) {
      this.current.update(currentTime);
      if (this.current.isPlaying() == false) this.current = undefined;
    }
  }
}

export class Tween {
  private startTime!: number;
  private config!: TweenConfig;
  private current!: TweenType;
  private play = false;
  private reverse = false;

  constructor(config: TweenConfig) {
    this.config = config;
    if (this.config.relative === true) this.current = { ...config.from };
  }

  private lerp(begin: number, end: number, alpha: number): number {
    return begin * (1 - alpha) + end * alpha;
  }

  public update(currentTime: number): void {
    const elapsed = currentTime - this.startTime;
    const progress = Math.min(elapsed / this.config.duration, 1);
    const latest = this.config.ease(progress);
    const from = this.reverse ? "to" : "from";
    const to = this.reverse ? "from" : "to";

    for (const key in this.config.from) {
      this.current[key] = this.lerp(
        this.config[from][key],
        this.config[to][key],
        latest
      );
      if (this.config.relative === true)
        this.current[key] += this.config[from][key];
    }
    if (this.config.onUpdate) {
      this.config.onUpdate(this.current, latest);
    }
    if (progress >= 1) {
      if (this.config.onFinish) this.config.onFinish();
      this.play = false;
    }
  }

  public isPlaying(): boolean {
    return this.play;
  }

  public start(reverse = false): void {
    this.startTime = performance.now();
    this.play = true;
    if (!this.config.relative) this.current = { ...this.config.from };
    this.reverse = reverse;
    if (this.config.onStart) this.config.onStart();
  }
}
