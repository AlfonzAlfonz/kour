import "zx/globals";
import { parse } from "node-html-parser";

await $`pnpm tsc`;
argv.m === "debug"
  ? await $`pnpm vite build -m debug`
  : await $`pnpm vite build`;

const read = (file) => fs.readFile(file).then((b) => b.toString());

const html = parse(await read("./dist/index.html"));

html.querySelectorAll("script").forEach((n) => n.remove());
html.querySelectorAll(`link[rel="stylesheet"]`).forEach((n) => n.remove());

const styles = await fs
  .readdir("./dist/assets")
  .then((files) =>
    Promise.all(
      files
        .filter((f) => path.extname(f) == ".css")
        .map((f) => read(path.join("./dist/assets", f)))
    )
  );

const scripts = await fs
  .readdir("./dist/assets")
  .then((files) =>
    Promise.all(
      files
        .filter((f) => path.extname(f) == ".js")
        .map((f) => read(path.join("./dist/assets", f)))
    )
  );

const head = html.querySelector("head");
for (const s of styles) {
  head.appendChild(parse(`<style>${s}</style>`));
}

const body = html.querySelector("body");
for (const s of scripts) {
  body.appendChild(parse(`<script type="module">${s}</script>`));
}

fs.writeFile("./dist/build.html", html.toString());
