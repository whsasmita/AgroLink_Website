# --- Stage 1: Build (produksi) ---
FROM node:24-alpine AS build
WORKDIR /app

# Salin dan install dependensi
COPY package*.json ./
RUN npm ci

# Salin source & build
COPY . .
# (Opsional) build-time env untuk Vite:
# ARG VITE_API_URL
# ENV VITE_API_URL=$VITE_API_URL
RUN npm run build   # Vite => /app/dist, CRA => /app/build

# --- Stage 2: Serve static (tanpa Nginx) ---
FROM node:24-alpine
WORKDIR /srv

# Web server statis yang simpel & cepat
RUN npm i -g serve

# Vite: dist ; CRA: build (sesuaikan baris di bawah)
COPY --from=build /app/dist ./app

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1:3000 || exit 1

# -s = SPA fallback ke index.html, -l 3000 = listen di 3000
CMD ["serve", "-s", "app", "-l", "3000"]
