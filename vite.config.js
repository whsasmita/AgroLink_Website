import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import caseInsensitiveResolver from "./vite.caseInsensitiveResolver.js";

export default defineConfig({
  plugins: [react(), caseInsensitiveResolver()],
});
