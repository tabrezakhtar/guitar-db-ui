import { createServer } from "http";
import { createReadStream } from "fs";
import puppeteer from "puppeteer";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, "..", "dist");

function startServer(port) {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      const filePath = path.join(distDir, req.url === "/" ? "index.html" : req.url);
      const stream = createReadStream(filePath).on("error", () => {
        res.writeHead(404);
        res.end("Not Found");
      });
      stream.pipe(res);
    }).listen(port, () => resolve(server));
  });
}

function waitForServer(url, attempts = 50) {
  return new Promise((resolve, reject) => {
    const tryFetch = (remaining) => {
      fetch(url)
        .then(() => resolve())
        .catch((err) => {
          if (remaining <= 0) return reject(err);
          setTimeout(() => tryFetch(remaining - 1), 200);
        });
    };
    tryFetch(attempts);
  });
}

async function run() {
  const port = 3000;
  const url = `http://localhost:${port}`;
  const server = await startServer(port);

  try {
    await waitForServer(url);

    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0" });
    const html = await page.content();
    await browser.close();

    await fs.writeFile(path.join(distDir, "index.html"), html);
    console.log("Prerendered landing page written to dist/index.html");
  } finally {
    server.close();
  }
}

run().catch((err) => {
  console.error("Prerender failed:", err);
  process.exit(1);
});
