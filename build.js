import esbuild from "esbuild";
import { sassPlugin } from "esbuild-sass-plugin";
import { spawn } from "child_process";

const isDev = process.argv.includes("--dev");

async function start() {
    if (isDev) {
        // Context build for watch mode with SCSS
        const ctx = await esbuild.context({
            entryPoints: ["src/index.jsx"],
            bundle: true,
            outfile: "public/bundle.js",
            jsx: "automatic",
            plugins: [sassPlugin({ type: "css", cssOutputFile: "public/bundle.css" })],
            sourcemap: true,
        });

        await ctx.watch();
        console.log("✅ Watching files and bundling...");

        // Start a lightweight static server
        const server = spawn("npx", ["serve", "public", "-l", "8000"], {
            stdio: "inherit",
            shell: true,
        });

        server.on("spawn", () => {
            console.log("🚀 Dev server running at: http://localhost:8000");
            console.log("Open this URL in your browser to see your app.");
        });

    } else {
        // Production build
        await esbuild.build({
            entryPoints: ["src/index.jsx"],
            bundle: true,
            outfile: "public/bundle.js",
            jsx: "automatic",
            minify: true,
            plugins: [sassPlugin()],
        });
        console.log("✅ Production build complete.");
    }
}

start();
