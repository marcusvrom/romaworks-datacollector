# RomaWorks DataCollector (Tauri + React + Prisma)

## 1) Setup do projeto

```bash
# 1. criar app React + TS
npm create vite@latest romaworks-datacollector -- --template react-ts
cd romaworks-datacollector

# 2. instalar Tailwind
npm i -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 3. instalar Tauri
npm i -D @tauri-apps/cli
npm i @tauri-apps/api @tauri-apps/plugin-http
npx tauri init

# 4. instalar Prisma + SQLite
npm i @prisma/client
npm i -D prisma
npx prisma init --datasource-provider sqlite
npm run prisma:generate
npm run prisma:migrate

# 5. rodar em modo desktop
npm run tauri dev
```

## Fluxo
1. Usuário informa API key do Google Places (salva localmente no app).
2. Usuário digita termo de busca e inicia a prospecção.
3. App chama Google Places Text Search e depois Details.
4. App tenta enriquecer com CNPJ/e-mail por nome da empresa.
5. E-mail passa por blocklist e telefone por regex de WhatsApp.
6. Lead é salvo em SQLite via Prisma.
7. Tabela mostra resultados e permite exportar CSV/limpar base.
