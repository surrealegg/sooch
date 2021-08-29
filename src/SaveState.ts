import LZString from "lz-string";

export class SaveState {
  private data: SaveFormat = {
    clicks: 0,
    soochPerSecond: 0,
    achievements: [],
    count: 0,
    ascend: 0,
    helpers: [],
    createdAt: 0,
    updatedAt: 0,
    upgrades: [],
  };
  private uploadButton!: HTMLInputElement | null;
  private counterElement!: HTMLParagraphElement | null;
  private soochPerSecondElement!: HTMLParagraphElement | null;

  constructor() {
    const buttonSave = document.getElementById("action-save");
    if (buttonSave) buttonSave.addEventListener("click", () => this.save());

    const buttonSaveAsFile = document.getElementById("action-save-as-file");
    if (buttonSaveAsFile)
      buttonSaveAsFile.addEventListener("click", () => this.saveAsFile());

    const buttonReset = document.getElementById("action-reset");
    if (buttonReset) buttonReset.addEventListener("click", () => this.reset());

    const buttonLoad = document.getElementById("action-load");
    if (buttonLoad) buttonLoad.addEventListener("click", () => this.load());

    const buttonLoadFromFile = document.getElementById("action-load-from-file");
    if (buttonLoadFromFile)
      buttonLoadFromFile.addEventListener("click", () =>
        this.uploadButton?.click()
      );

    this.counterElement = document.getElementById(
      "score"
    ) as HTMLParagraphElement | null;
    this.soochPerSecondElement = document.getElementById(
      "sps"
    ) as HTMLParagraphElement | null;

    this.uploadButton = document.getElementById(
      "hidden-file-upload"
    ) as HTMLInputElement;
    this.uploadButton.addEventListener("change", () => {
      if (this.uploadButton) this.loadFromFile(this.uploadButton.files);
    });

    this.autoSave();
    const savedData = localStorage.getItem("sooch");
    if (savedData !== null) {
      const decompressedData = this.getDataFromString(savedData);
      if (decompressedData !== null) {
        this.data = decompressedData;
        this.updateDOM();
        return;
      }
    }
    this.data.createdAt = Date.now();
  }

  private compress(): string {
    this.data.updatedAt = Date.now();
    return LZString.compressToBase64(JSON.stringify(this.data));
  }

  private autoSave(): void {
    setTimeout(() => {
      this.save();
      this.autoSave();
    }, 30000);
  }

  public save(): void {
    localStorage.setItem("sooch", this.compress());
  }

  private getDataFromString(data: string): SaveFormat | null {
    const decompressedData = LZString.decompressFromBase64(data);
    try {
      if (decompressedData !== null)
        return JSON.parse(decompressedData) as SaveFormat;
    } catch (e) {
      return null;
    }
    return null;
  }

  private loadData(data: string | null): void {
    if (data && this.getDataFromString(data) !== null) {
      localStorage.setItem("sooch", data);
      location.reload();
    }
  }

  public loadFromFile(files: FileList | null): void {
    if (files === null || files.length === 0) return;
    const reader = new FileReader();
    reader.readAsText(files[0]);
    reader.onload = (event) => this.loadData(event.target?.result as string);
    this.uploadButton?.click();
  }

  public load(): void {
    const data = prompt("Paste the code here");
    this.loadData(data);
  }

  public reset(): void {
    if (
      confirm(
        "This will reset all your progress. Are you sure you want to start a new game?"
      )
    ) {
      localStorage.removeItem("sooch");
      location.reload();
    }
  }

  public saveAsFile(): void {
    const blob = new Blob([this.compress()], {
      type: "application/octet-binary",
    });
    const link = document.createElement("a");
    link.download = `sooch-${Date.now()}.txt`;
    link.href = URL.createObjectURL(blob);
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  }

  public updateDOM(): void {
    if (this.soochPerSecondElement)
      this.soochPerSecondElement.innerText = `${this.data.soochPerSecond} per second`;
    if (this.counterElement)
      this.counterElement.innerText = `${this.data.count} sooch`;
    document.title = `${this.data.count} sooch - Sooch master`;
  }

  public addClick(count: number): void {
    this.data.clicks++;
    this.data.count += count;
    this.updateDOM();
  }

  public addHelper(id: number): void {
    if (!this.data.helpers[id]) this.data.helpers[id] = 0;
    this.data.helpers[id]++;
  }

  public addAchievement(name: string): void {
    this.data.achievements.push(name);
  }

  public addSoochPerSecond(sps: number): void {
    this.data.soochPerSecond += sps;
  }

  public setCount(count: number): void {
    this.data.count = count;
  }

  public addAscend(): void {
    this.data.count = 0;
    this.data.soochPerSecond = 0;
    this.data.ascend++;
    this.data.helpers = [];
    this.data.upgrades = [];
  }

  get count(): number {
    return this.data.count;
  }

  get ascend(): number {
    return this.data.ascend;
  }

  get soochPerSecond(): number {
    return this.data.soochPerSecond;
  }

  get achievements(): string[] {
    return this.data.achievements;
  }

  get helpers(): { [id: number]: number } {
    return this.data.helpers;
  }

  get upgrades(): number[] {
    return this.data.upgrades;
  }

  get createdAt(): number {
    return this.data.createdAt;
  }

  get updatedAt(): number {
    return this.data.updatedAt;
  }
}
