// vite.caseInsensitiveResolver.js
import { promises as fs } from "fs";
import path from "path";

async function findCaseInsensitive(p) {
  // Jika ada persis → pakai itu
  try {
    await fs.access(p);
    return p;
  } catch { /* empty */ }
  const dir = path.dirname(p);
  const base = path.basename(p);
  let entries = [];
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return null;
  }
  // Cari nama yang sama tanpa peduli kapitalisasi
  const hit = entries.find((e) => e.name.toLowerCase() === base.toLowerCase());
  return hit ? path.join(dir, hit.name) : null;
}

export default function caseInsensitiveResolver() {
  return {
    name: "case-insensitive-resolver",
    async resolveId(source, importer) {
      // hanya tangani relative import
      if (!importer || !source.startsWith(".")) return null;

      const resolved = path.resolve(path.dirname(importer), source);

      // Coba dengan ekstensi seperti apa adanya
      let candidate = await findCaseInsensitive(resolved);
      if (candidate) return candidate;

      // Coba tambahkan ekstensi umum (untuk assets & komponen)
      const exts = [".tsx", ".ts", ".jsx", ".js", ".json", ".png", ".jpg", ".jpeg", ".svg", ".webp"];
      for (const ext of exts) {
        candidate = await findCaseInsensitive(resolved + ext);
        if (candidate) return candidate;
      }

      // Coba index file di folder
      for (const ext of ["/index.tsx", "/index.ts", "/index.jsx", "/index.js"]) {
        candidate = await findCaseInsensitive(resolved + ext);
        if (candidate) return candidate;
      }

      return null; // biarkan Vite error kalau tetap tidak ketemu
    },
  };
}
