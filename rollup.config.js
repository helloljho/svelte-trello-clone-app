import path from "path";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import alias from "@rollup/plugin-alias";
import svelte from "rollup-plugin-svelte";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import css from "rollup-plugin-css-only";
import replace from "@rollup/plugin-replace";
import dotenv from "dotenv";
import globals from "rollup-plugin-node-globals";
import builtins from "rollup-plugin-node-builtins";
import sveltePreprocess from "svelte-preprocess";

dotenv.config();

const production = !process.env.ROLLUP_WATCH;

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = require("child_process").spawn(
        "npm",
        ["run", "start", "--", "--dev"],
        {
          stdio: ["ignore", "inherit", "inherit"],
          shell: true,
        }
      );

      process.on("SIGTERM", toExit);
      process.on("exit", toExit);
    },
  };
}

export default {
  input: "src/main.js",
  output: {
    sourcemap: true,
    format: "iife",
    name: "app",
    file: "public/build/bundle.js",
  },
  plugins: [
    svelte({
      compilerOptions: {
        dev: !production,
      },
      preprocess: sveltePreprocess({
        scss: {
          prependData: '@import "./src/scss/main.scss";',
        },
        postcss: {
          plugins: [require("autoprefixer")()],
        },
      }),
    }),
    replace({
      OMDB_API_KEY: JSON.stringify(process.env.OMDB_API_KEY),
      values: {
        "crypto.randomBytes": 'require("randombytes")',
      },
    }),
    css({ output: "bundle.css" }),

    resolve({
      browser: true,
      dedupe: ["svelte"],
    }),
    commonjs(),
    globals(),
    builtins(),
    alias({
      entries: [
        {
          find: "~",
          replacement: path.resolve(__dirname, "src/"),
        },
      ],
    }),

    !production && serve(),
    !production && livereload("public"),
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
};
