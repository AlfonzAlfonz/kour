import "zx/globals";
import sharp from "sharp";

let img = sharp("./textures/6.png");

let { width, height } = await img.metadata();

console.info(`Image width: ${width}, height: ${height}`);

if (width !== height) {
  throw new Error("Image width is different from its height");
}

if (width % 4 !== 0) {
  const s = 512;
  img = img.resize(s);
  width = s;
  height = s;
  console.info(`Image resized to ${width}`);
}

const dWidth = width / 4;

await fs
  .readdir(path.join(".", "public"), { withFileTypes: true })
  .then((d) =>
    d
      .filter((f) => f.isFile() && f.name.startsWith("image"))
      .map((f) => fs.rm(path.join(".", "public", f.name)))
  )
  .then((p) => Promise.all(p));

await spinner("Resizing", async () => {
  for (const [x] of Array(4).entries()) {
    for (const [y] of Array(4).entries()) {
      await img
        .extract({
          left: x * dWidth,
          top: y * dWidth,
          width: dWidth,
          height: dWidth,
        })
        .toFile(`./public/image${x + 1}x${y + 1}.png`);
    }
  }
});

console.log("Done!");
