import { Loader } from "pixi.js";
import { Game } from "./Game";

function onTabClick(id: string): void {
  const tabList = document.getElementsByClassName(
    "page"
  ) as HTMLCollectionOf<HTMLDivElement>;
  const target = document.getElementById(id);
  if (!target) return;
  for (let i = 0; i < tabList.length; ++i) tabList[i].style.display = "none";
  target.style.display = "block";
}

const tabList = document.getElementsByClassName("tab");
for (let i = 0; i < tabList.length; ++i)
  tabList[i].addEventListener("click", () => {
    for (let j = 0; j < tabList.length; ++j)
      tabList[j].classList.remove("active");
    tabList[i].classList.add("active");
    onTabClick(tabList[i].getAttribute("data-click") as string);
  });

const loader = new Loader();
const sprites: SpriteResources = {};

loader.add("default", "/assets/sprites/sooch.png");
loader.add("bronze", "/assets/sprites/bronze.png");
loader.add("silver", "/assets/sprites/silver.png");
loader.add("golden", "/assets/sprites/golden.png");
loader.add("lava", "/assets/sprites/lava.png");
loader.add("invert", "/assets/sprites/invert.png");
loader.add("piston", "/assets/sprites/piston.png");
loader.add("background", "/assets/sprites/tile.png");
loader.load((_loader, resources) => {
  sprites.piston = resources.piston.texture;
  sprites.sooch = {};
  sprites.sooch.default = resources.default.texture;
  sprites.sooch.bronze = resources.bronze.texture;
  sprites.sooch.silver = resources.silver.texture;
  sprites.sooch.invert = resources.invert.texture;
  sprites.sooch.golden = resources.golden.texture;
  sprites.sooch.lava = resources.lava.texture;
  sprites.tile = resources.background.texture;

  new Game(sprites);
});
