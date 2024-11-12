import {defineConfig} from "vite";
import {ViteEjsPlugin} from "vite-plugin-ejs"
import { ViteMinifyPlugin } from 'vite-plugin-minify'

import contact from './src/data/contact.json'
import schedule from './src/data/schedule.json'
import views from './src/data/views.json'

export default defineConfig({
    base: '',
    root: 'src',
    build: {
        outDir: '../dist',
        emptyOutDir: true
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