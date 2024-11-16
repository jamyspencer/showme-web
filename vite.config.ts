import { defineConfig, Plugin, ResolvedConfig } from "vite"
import { ViteEjsPlugin } from "vite-plugin-ejs"
import generateFile from "vite-plugin-generate-file"
import { ViteMinifyPlugin } from "vite-plugin-minify"

import contact from "./src/data/contact.json"
import schedule from "./src/data/schedule.json"
import views from "./src/data/views.json"
import { resolve } from "node:path"

export default defineConfig({
    base: "",
    root: "src",
    build: {
        outDir: "../dist",
        assetsDir: "",
        emptyOutDir: true,
    },
    plugins: [
        ViteMinifyPlugin({}),
        ViteEjsPlugin({
            contact,
            schedule,
            views,
        }),
        generateFile([
            {
                type: "template",
                output: ".htaccess",
                data: {
                    views,
                },
                template: resolve(__dirname, "src/htaccess.ejs"),
            },
        ]),
    ],
})
