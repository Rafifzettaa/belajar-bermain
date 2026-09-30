import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../out/", import.meta.url));
const PORT = Number(process.env.PORT ?? 3111);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".mp3": "audio/mpeg",
  ".ogg": "audio/ogg",
  ".wav": "audio/wav",
  ".m4a": "audio/mp4",
};

async function resolve(pathname) {
  const clean = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, "");
  const candidates = clean.endsWith("/")
    ? [join(ROOT, clean, "index.html")]
    : [join(ROOT, clean), join(ROOT, clean, "index.html"), join(ROOT, `${clean}.html`)];
  for (const c of candidates) {
    if (!c.startsWith(ROOT)) continue;
    try {
      const s = await stat(c);
      if (s.isFile()) return c;
    } catch {
      /* next candidate */
    }
  }
  return null;
}

createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);
  let file = await resolve(url.pathname);
  let status = 200;

  if (!file) {
    file = join(ROOT, "404.html");
    status = 404;
  }

  try {
    const body = await readFile(file);
    res.writeHead(status, {
      "Content-Type": TYPES[extname(file)] ?? "application/octet-stream",
      "Cache-Control": file.includes(`${join(ROOT, "_next")}`) ? "public, max-age=31536000, immutable" : "no-cache",
    });
    res.end(body);
  } catch {
    res.writeHead(500).end("Internal error");
  }
}).listen(PORT, () => console.log(`serving ${ROOT} on http://localhost:${PORT}`));
