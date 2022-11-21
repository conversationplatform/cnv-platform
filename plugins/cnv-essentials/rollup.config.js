import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import postcss from "rollup-plugin-postcss";
import json from "@rollup/plugin-json";
import builtins from "rollup-plugin-node-builtins";
import globals from "rollup-plugin-node-globals";
import replace from "@rollup/plugin-replace";
import React from "react";
import ReactDOM from "react-dom";
import babel from "rollup-plugin-babel";
import terser from '@rollup/plugin-terser';
import image from "@rollup/plugin-image";


const packageJson = require("./package.json");
export default {
  input: "widgets/widgetProvider.tsx",
  external: ['react', 'react-dom'],
  output: [
    {
      name: packageJson.name,
      format: "umd",
      dir: 'resources',
      sourcemap: false,
      globals: false
    }
  ],
  plugins: [
    peerDepsExternal({
      preferBuiltins: true
    }),
    resolve(),
    babel({
      exclude: "node_modules/**"
    }),
    commonjs({
      namedExports: {
        "react-dom": Object.keys(ReactDOM),
        react: Object.keys(React),
      }
    }),
    typescript({
      useTsconfigDeclarationDir: true,
      rollupCommonJSResolveHack: true,

    }),
    postcss(),
    json(),
    replace({
      "process.env.NODE_ENV": JSON.stringify("production")
    }),
    globals(),
    builtins(),
    terser(),
    image(),
  ],

};

const fs = require('fs');

const nodes = {};

const mapFolder = (folder) => {
  const entries = fs.readdirSync(folder);
  entries.forEach(entry => {
    const path = `${folder}/${entry}`;
    if(fs.lstatSync(path).isDirectory()) {
      mapFolder(path);
    } else {
      const node = folder.slice(folder.lastIndexOf('/') + 1);
      const file = path.slice(path.lastIndexOf('/') + 1);
      if(path.endsWith('.js') && entries.includes(file.replace('.js', '.html'))) {
        console.log(`${node} => ${path}`)
        nodes[node] = path;
      }
    }
  })
}

mapFolder('nodes');



packageJson["node-red"] = { nodes };

fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
