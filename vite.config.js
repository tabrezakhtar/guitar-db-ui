import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import fs from 'fs/promises'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ["babel-plugin-react-compiler"],
        ],
      },
    }),
    tailwindcss(),
    {
      name: 'copy-static-files',
      async writeBundle() {
        const filesToCopy = ['contact.html', 'terms.html', 'privacy.html'];
        
        for (const file of filesToCopy) {
          try {
            const fileContent = await fs.readFile(file, 'utf-8');
            await fs.mkdir('dist', { recursive: true });
            await fs.writeFile(`dist/${file}`, fileContent);
            console.log(`Successfully copied ${file} to build output`);
          } catch (error) {
            console.error(`Error copying ${file}:`, error);
          }
        }
      }
    }
  ]
})
