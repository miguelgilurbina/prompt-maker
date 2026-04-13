# Prompt Maker — Project Document

> Última actualización: 2026-04-12
> Branch activo: `dev`

---

## ¿Qué es Prompt Maker?

**Prompt Maker es una consultora de software, producto e inteligencia artificial.**

El sitio es el centro de negocio desde donde se ofrecen servicios, se demuestran capacidades y se hospedan proyectos propios. No es una app de comunidad — es una plataforma de negocio personal con productos internos como diferenciadores.

---

## Servicios ofrecidos

| Servicio | Descripción |
|----------|-------------|
| Estrategia de producto | De la idea al roadmap — mercado, propuesta de valor, plan de ejecución |
| Desarrollo a medida | Apps, APIs y sistemas con las tecnologías correctas |
| Web Agency con IA | Presencia digital automatizada con orquestación de agentes |
| Prompt Engineering | Cursos, talleres y consultoría para dominar modelos de IA |
| Identidad visual con IA | Marca, ilustración y assets generados y refinados con IA |

---

## Proyectos internos

### 1. Web Agency Automatizada (`/portafolio`)
Demo en vivo del servicio de web agency. Un sistema de agentes que:
- Entrevista al cliente (Puppet Master Agent)
- Extrae y organiza requisitos en un brief estructurado
- Genera el sitio con un equipo de agentes (Design → Code → Deploy)
- Despliega automáticamente vía Vercel/Netlify API

El portafolio mostrará 3 variantes de un mock project (landing minimal, landing bold, tienda + carrito) construidas por el propio sistema.

### 2. Bias Encyclopedia (`/bias`)
Base de conocimiento acumulativa sobre bias en modelos de IA.
- **Banco de preguntas** organizadas por categoría y dificultad (nivel 1-5)
- **Categorías de bias**: político, género, racial, geográfico, económico, religioso, cognitivo
- **Registro histórico** de respuestas por modelo y versión
- **Benchmark comparativo**: score por modelo × categoría, evolución en el tiempo
- **Diccionario de bias**: cada tipo tiene definición, cómo se manifiesta en LLMs, ejemplos

### 3. Prompt Library (`/lab`)
Librería curada de prompts de ingeniería. Repositorio para crear, organizar y compartir prompts. Reposicionada de producto principal a herramienta interna / lab.

---

## Stack tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Framework | Next.js (App Router) | 16.2.1 |
| Frontend | React + TypeScript | 19.2 / 5.9 |
| Estilos | Tailwind CSS v4 | 4.1.18 |
| Base de datos | PostgreSQL + Prisma ORM | 7.4.0 |
| Auth | NextAuth (JWT + Credentials) | 4.24.13 |
| Estado | Zustand + SWR | 5.0 / 2.4 |
| Rate Limiting | Upstash Redis | 1.36.2 |
| Hosting | Vercel | — |
| BD Producción | Supabase PostgreSQL (sa-east-1) | — |
| CI/CD | GitHub Actions + Vercel auto-deploy | — |

---

## Paleta de colores — Dusk & Ember

```
Background:     #090910   hsl(240 33% 6%)     noche profunda
Surface:        #11111C   hsl(240 27% 9%)     cards / panels
Surface-2:      #18182A   hsl(240 25% 13%)    hover states
Border:         #252538   hsl(240 20% 19%)    separadores
Text:           #F0EEF8   hsl(250 40% 96%)    crema violácea
Muted:          #64637A   hsl(246 10% 44%)    subtítulos

Brand (violet): #A78BFA   hsl(263 93% 76%)    color principal
Accent (orange):#FB923C   hsl(25 97% 60%)     CTAs energéticos
Sky (data):     #38BDF8   hsl(199 89% 60%)    datos / tech
Success:        #34D399   hsl(160 68% 52%)    estados positivos
```

**Dirección visual pendiente:** El usuario quiere algo visualmente más potente.
Referencia: *"neo tech 2000"* — reminiscente a Y2K/cyberpunk/neon tech.
Más agresivo en contraste, efectos más pronunciados. El Dusk & Ember actual es buena base pero necesita más impacto.

---

## Mascota — El Escribano

Concepto: un **escribano histórico** como cara de la marca. Los escribas fueron los primeros "prompt engineers" — sabían exactamente cómo formular, estructurar y preservar el conocimiento. Metáfora perfecta para prompt engineering y consultoría.

**Variantes culturales planeadas:**

| Variante | Cultura | Herramienta | Rol en el sitio |
|----------|---------|-------------|----------------|
| Griego | Grecia clásica | Stylus + tablilla | Mascota principal |
| Egipcio | Antiguo Egipto | Reed pen + papiro | Bias Encyclopedia |
| Monje | Europa medieval | Pluma + pergamino | Prompt Library |
| Calígrafo | Imperio Otomano | Cálamo + tinta | Cursos |
| Tlacuilo | Azteca / Maya | Pluma de quetzal | Web Agency |

**Estilo visual:** Vector plano / ilustración moderna SVG. Animaciones sutiles (idle float, hover reaction). Sin pixel art para la mascota principal — más profesional para contexto B2B.

**Estado:** No implementado aún. Pendiente de diseño.

---

## Arquitectura de rutas

```
/                     Landing consultora (implementado)
/servicios            Detalle de servicios (implementado)
/contacto             Formulario de contacto (implementado — sin email real aún)
/portafolio           Web Agency demo (pendiente)
  /portafolio/minimal   Variante landing minimal
  /portafolio/bold      Variante landing bold
  /portafolio/store     Tienda + carrito
/bias                 Bias Encyclopedia (pendiente)
  /bias/[categoria]     Página de categoría
  /bias/benchmark       Comparador de modelos
  /bias/metodologia     Cómo funciona
/lab                  Prompt Library (existente, reposicionada)
/cursos               Cursos de prompt engineering (pendiente)
/auth/signin          Login
/auth/signup          Registro
/auth/forgot-password Reset de password
```

---

## Decisiones técnicas importantes

### ThemeProvider removido del root layout
El ThemeProvider original aplicaba CSS variables vía `useEffect` en el cliente, causando un flash visual (FOUC). Para la consulting site que tiene un único tema (Dusk & Ember), se eliminó del layout principal. Las variables CSS viven directamente en `globals.css` → `:root`. El ThemeProvider está disponible para el Lab/tools cuando se necesite selector de temas.

### Prisma v7 — PrismaPg requiere Pool
En Prisma v7, `PrismaPg` ya no acepta un connection string directamente. Requiere una instancia de `Pool` de `pg`:
```ts
// CORRECTO (v7)
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)

// INCORRECTO (v6 y anterior)
const adapter = new PrismaPg(process.env.DATABASE_URL!)
```

### Server Components vs Client Components
- `page.tsx` (home) es server component — no usa hooks ni event handlers
- `ProjectsSection` es server component — glow on hover 100% CSS con Tailwind arbitrary values
- Solo se usa `"use client"` donde hay estado real (formularios, interacciones complejas)

---

## Roadmap

### ✅ Fase 0 — Marca y estructura (COMPLETADO — 2026-04-12)

- [x] Fix crítico: `PrismaPg` con `Pool` (build roto)
- [x] Paleta Dusk & Ember implementada en `globals.css`
- [x] Nueva home page (landing consultora)
- [x] Nueva navegación: Servicios / Portafolio / Lab / Bias / Contacto
- [x] Página `/servicios` con detalle y entregables
- [x] Página `/contacto` con formulario (sin email transaccional real aún)
- [x] Footer rediseñado con navegación real
- [x] Metadata SEO actualizada (consultora, español)
- [x] ThemeProvider removido del root — sin flash de estilos

### 🔲 Fase 0.5 — Visual upgrade (PRÓXIMO)

- [ ] Revisión de la identidad visual: "neo tech 2000" / más impacto
  - Efectos más pronunciados en hero (scanlines, glitch, neon glow)
  - Tipografía más agresiva / display font para headings
  - Gradientes más saturados
  - Animaciones del hero más dinámicas
- [ ] Diseño de la mascota (escribano griego como figura principal)
- [ ] Copy mejorado (hero, servicios, CTAs)
- [ ] Email transaccional en `/contacto` (Resend o Nodemailer)

### 🔲 Fase 1 — Web Agency Demo (4 semanas)

- [ ] Estructura de `/portafolio` con las 3 variantes del mock project
- [ ] Mock landing "minimal" — demo en vivo
- [ ] Mock landing "bold" — demo en vivo
- [ ] Mock tienda + carrito — demo en vivo
- [ ] Página `/portafolio` con cards, tech stack, CTAs
- [ ] Flujo de intake del Puppet Master Agent (MVP — conversacional básico)

### 🔲 Fase 2 — Bias Encyclopedia (5 semanas)

- [ ] Schema de BD: `BiasCategory`, `Question`, `ModelResponse`, `BenchmarkRun`
- [ ] Banco inicial: ~50 preguntas, niveles 1-3, categorías básicas
- [ ] Integración con APIs: Anthropic, OpenAI, Gemini
- [ ] UI del diccionario: índice de categorías + página por categoría
- [ ] Motor de scoring básico
- [ ] Primera versión del benchmark (3 modelos)
- [ ] Página `/bias/metodologia`
- [ ] Share link por evaluación / resultado

### 🔲 Fase 3 — Puppet Master completo (6 semanas)

- [ ] Agente entrevistador multi-turn (extrae brief estructurado)
- [ ] Pipeline: brief → Design Agent → Code Agent → Deploy Agent
- [ ] Integración con Vercel API para deploy automático
- [ ] Panel del cliente con estado y outputs

### 🔲 Fase 4 — Cursos y monetización

- [ ] Estructura de `/cursos` (módulos, preview gratuita)
- [ ] Stripe para cursos y servicio Web Agency
- [ ] Sistema de acceso por compra
- [ ] Freemium: límites en Prompt Library (10 privados gratis, ilimitados en Pro)

### 🔲 Pendiente operacional (requiere dashboards externos)

- [ ] Email transaccional real (Resend o SendGrid)
- [ ] Comprar dominio propio y configurar DNS
- [ ] Actualizar `NEXTAUTH_URL` y `NEXT_PUBLIC_API_URL` en Vercel con dominio final
- [ ] Habilitar Vercel Analytics
- [ ] Branch protection en `main` (requiere GitHub Settings)
- [ ] Google Search Console (requiere dominio final)

---

## Variables de entorno requeridas en producción

```
NODE_ENV=production
NEXTAUTH_SECRET=<32-byte-hex>
NEXTAUTH_URL=https://<tu-dominio>
NEXT_PUBLIC_API_URL=https://<tu-dominio>
DATABASE_URL=postgresql://<user>:<pass>@<host>:5432/<db>?sslmode=require
DATABASEPASSWORD=<password>
UPSTASH_REDIS_REST_URL=<redis-endpoint>
UPSTASH_REDIS_REST_TOKEN=<redis-token>
```

---

## Estado de la Prompt Library (heredado)

La librería original tenía estas features:

| Feature | Estado |
|---------|--------|
| Auth (login/registro/reset password) | ✅ 95% — sin email real |
| CRUD de prompts | ✅ 90% — falta editar |
| Búsqueda y paginación | ✅ completo |
| Votos | ⚠️ 40% — UI existe, sin API backend |
| Comentarios | ⚠️ 40% — UI existe, sin API backend |
| Perfil de usuario | ❌ 0% |
| Edición de prompts | ⚠️ 20% — carpeta vacía |
| Dashboard personal | ❌ 0% |

Estas features se completan en el contexto del Lab (`/lab`) — no son prioridad de la consulting site.
