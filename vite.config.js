import {defineConfig} from "vite";
import {ViteEjsPlugin} from "vite-plugin-ejs"
import { ViteMinifyPlugin } from 'vite-plugin-minify'
import contact from './data/contact.json'
import schedule from './data/schedule.json'

export default defineConfig({
  plugins: [
    ViteMinifyPlugin({}),
    ViteEjsPlugin({
      contact,
      schedule
    }),
  ],
});