import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { resolve } from 'path'
import fs from 'fs/promises'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'copy-static-files',
      async writeBundle() {
        // Ensure the contact.html file exists
        try {
          const contactFile = await fs.readFile('contact.html', 'utf-8')
          await fs.mkdir('dist', { recursive: true })
          await fs.writeFile('dist/contact.html', contactFile)
          console.log('Successfully copied contact.html to build output')
        } catch (error) {
          console.error('Error copying contact.html:', error)
        }
      }
    }
  ],
  server: {
    headers: {
      "Cache-Control": "no-store"
    }
  }
})
