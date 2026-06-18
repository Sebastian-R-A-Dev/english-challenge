# English Challenge

Plataforma gamer de retos de inglés dentro del ecosistema **ArcadeCore**. Los jugadores compiten en sets de preguntas cronometradas, ganan XP, suben de nivel y aparecen en el ranking global.

## De qué trata

English Challenge es una SPA en Next.js orientada a la competición: medir y mejorar el inglés mientras compites con otros jugadores registrados en la misma app (`ENGLISH-CHALLENGE`).

**Landing (`/`)**

- Hero y acceso al reto
- Hub del jugador (nivel, XP, mensaje de hito por nivel)
- Explicación de reglas y mecánicas
- Tabla de ranking (top jugadores vía ArcadeCore)

**Reto (`/challenge`)**

- Lobby con intro y música opcional (pistas desde ArcadeCore)
- Ruleta de dificultad: el servidor asigna un bracket (casual → nightmare)
- Rondas de preguntas con temporizador (gramática, vocabulario, comprensión)
- Puntuación por precisión: aciertos suman; un fallo o timeout puede terminar la ronda
- Al completar o abandonar, el progreso (XP, nivel, scores) se sincroniza con ArcadeCore

**Autenticación**

- Login/registro en **generic-login** con `redirect-to=ENGLISH-CHALLENGE`
- Sesión y refresh cookie gestionados por ArcadeCore; el front usa Bearer token en las APIs

## Stack

Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, Zustand, Zod.

## Requisitos

- [ArcadeCore](https://github.com/Sebastian-R-A-Dev/arcade-core) en marcha (`http://localhost:4000`)
- [generic-login](https://github.com/Sebastian-R-A-Dev/generic-login) (`http://localhost:3000`)
- App `ENGLISH-CHALLENGE` registrada y con contenido (preguntas, dificultades) en ArcadeCore / admin dashboard

## Configuración

```bash
cp .env.example .env.local
npm install
npm run dev
```

Variables en `.env.example`:

| Variable | Descripción |
|----------|-------------|
| `NEXT_PUBLIC_ARCADECORE_API_BASE_URL` | Origen del API (sin slash final) |
| `NEXT_PUBLIC_LOGIN_URL` | URL de generic-login (incluye `/login`) |
| `NEXT_PUBLIC_APP_NAME` | `ENGLISH-CHALLENGE` — debe coincidir con `App.name` en ArcadeCore |

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Servir build |
| `npm run lint` | ESLint |
