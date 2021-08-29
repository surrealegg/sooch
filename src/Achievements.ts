export const enum AchievementCompare {
  EQUAL,
  LESS,
  GREAT,
  LESS_EQUAL,
  GREAT_EQUAL,
}

export class Achievements {
  private list: { [name: string]: Achievement } = {};

  public add(name: string, achievement: Achievement): void {
    this.list[name] = achievement;
  }

  public check(): void {
    // TO-DO: Implement checker
  }
}
