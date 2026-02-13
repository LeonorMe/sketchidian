import esbuild from "esbuild";

esbuild.build({
  entryPoints: ["src/main.ts"],
  bundle: true,
  outfile: "main.js",
  external: ["obsidian"],
  format: "cjs",
  target: "es2020",
  sourcemap: true
}).catch(() => process.exit(1));
