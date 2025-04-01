import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// import themes from 'daisyui/theme/object'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  daisyui:{
    themes:[
      "light",
      "dark",
      "cupcake"
    ]
  }
})
