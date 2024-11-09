import {defineConfig} from "vite";
import {ViteEjsPlugin} from "vite-plugin-ejs"
import { ViteMinifyPlugin } from 'vite-plugin-minify'
import { resolve } from 'node:path'

import contact from './src/data/contact.json'
import schedule from './src/data/schedule.json'
import views from './src/data/views.json'
const viewContent =  [resolve(__dirname, "./src/views")]

console.log(viewContent)
export default defineConfig({
    base: '',
    root: 'src',
    build: {
        outDir: 'dist'
    },
    plugins: [
        ViteMinifyPlugin({}),
        ViteEjsPlugin({
            contact,
            schedule,
            views
        }),
    ],
});