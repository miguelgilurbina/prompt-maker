# Prompt Maker - Plan de Despliegue Completo

## Analisis del Proyecto

### Stack Tecnologico

| Capa | Tecnologia | Version |
|------|-----------|---------|
| Framework | Next.js (App Router) | 16.1.6 |
| Frontend | React + TypeScript | 19.2 / 5.9 |
| Estilos | Tailwind CSS v4 + shadcn/ui | 4.1.18 |
| Base de datos | PostgreSQL + Prisma ORM | 7.4.0 |
| Auth | NextAuth (JWT + Credentials) | 4.24.13 |
| Estado | Zustand + SWR | 5.0 / 2.4 |
| Rate Limiting | Upstash Redis | 1.36.2 |
| Testing | Jest + React Testing Library | 30.2.0 |

### Arquitectura

- **7 modelos en BD**: User, Account, Session, VerificationToken, Prompt, Comment, Vote
- **Auth completo**: Login, registro, recuperacion de contrasena con tokens
- **API REST**: CRUD de prompts, sistema de votos y comentarios, paginacion
- **Temas**: Sistema de temas con dark mode (Matrix, Japanese Minimal, etc.)
- **Moderacion de contenido**: Sistema propio integrado
- **Seguridad**: bcrypt, rate limiting con Redis, validacion Zod

### Estado de Despliegue Actual

- **Hosting**: Vercel (`prompt-maker-project.vercel.app`)
- **BD Produccion**: Supabase PostgreSQL (region sa-east-1)
- **Redis**: Upstash
- **CI/CD**: GitHub Actions + Vercel auto-deploy
- **Dominio propio**: Pendiente de compra

---

## Plan de Despliegue

### Fase 1 - Pre-despliegue (Preparacion)

- [x] **1.1** Verificar que `npm run build` pasa sin errores ni warnings
- [x] **1.2** Revisar bundle size y optimizar imports si es necesario
- [x] **1.3** Confirmar que las variables de entorno de produccion estan completas
- [x] **1.4** Confirmar que `.env`, `.env.local` estan en `.gitignore`
- [x] **1.5** Verificar que no hay secretos expuestos en el repositorio
- [x] **1.6** Revisar headers de seguridad (CSP, HSTS, X-Frame-Options) - IMPLEMENTADO
- [x] **1.7** Validar que el rate limiting funciona correctamente (Upstash configurado)
- [x] **1.8** Ejecutar suite completa de tests (`npm test`) - 27/27 passed
- [ ] **1.9** Test manual de flujos criticos: registro, login, CRUD de prompts, votos

### Fase 2 - Dominio y DNS (requiere accion manual)

- [ ] **2.1** Comprar dominio (Namecheap, Cloudflare Registrar o Google Domains)
- [ ] **2.2** Configurar DNS: CNAME a `cname.vercel-dns.com`
- [ ] **2.3** Si es apex domain, registro A a `76.76.21.21`
- [ ] **2.4** Verificar que Vercel genera certificado SSL automaticamente

### Fase 3 - Configuracion de Produccion

- [ ] **3.1** Actualizar `NEXTAUTH_URL` en Vercel al dominio nuevo (requiere Vercel Dashboard)
- [ ] **3.2** Actualizar `NEXT_PUBLIC_API_URL` en Vercel al dominio nuevo (requiere Vercel Dashboard)
- [x] **3.3** Agregar dominio nuevo a `allowedOrigins` en `next.config.ts` - HECHO (agregar dominio final cuando se compre)
- [x] **3.4** Configurar headers de seguridad en `next.config.ts` - HECHO (HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
- [ ] **3.5** Agregar dominio en Vercel Dashboard > Settings > Domains (requiere Vercel Dashboard)
- [ ] **3.6** Verificar SSL funcionando correctamente

### Fase 4 - Infraestructura y Observabilidad

- [ ] **4.1** Verificar backups automaticos en Supabase (requiere Supabase Dashboard)
- [ ] **4.2** Configurar connection pooling en Supabase si no esta activo (requiere Supabase Dashboard)
- [ ] **4.3** Habilitar Vercel Analytics (requiere Vercel Dashboard)
- [ ] **4.4** Integrar Sentry (o similar) para error tracking
- [ ] **4.5** Configurar alertas para errores 5xx y latencia alta
- [x] **4.6** Habilitar Vercel Edge caching para rutas publicas - HECHO (via Cache-Control headers)
- [x] **4.7** Configurar `Cache-Control` headers en API de prompts publicos - HECHO (s-maxage=60, stale-while-revalidate=300)
- [ ] **4.8** Verificar que imagenes usan `next/image` con optimizacion

### Fase 5 - CI/CD y Calidad

- [x] **5.1** Crear GitHub Actions workflow (lint + type-check + tests + build) - HECHO (.github/workflows/ci.yml)
- [x] **5.2** Configurar deploy preview automatico en PRs - HECHO (Vercel auto-deploy en PR)
- [x] **5.3** Configurar deploy a produccion en merge a `main` - HECHO (Vercel auto-deploy en main)
- [ ] **5.4** Activar branch protection en `main` (require PR reviews + CI pass) - requiere GitHub Settings

### Fase 6 - Post-despliegue

- [x] **6.1** Configurar `metadata` en layout raiz (title, description, og tags, twitter cards, keywords) - HECHO
- [x] **6.2** Agregar `robots.txt` y `sitemap.xml` - HECHO (Next.js route handlers)
- [ ] **6.3** Verificar en Google Search Console (requiere dominio final)
- [ ] **6.4** Configurar email transaccional (Resend o SendGrid) para reset de password
- [ ] **6.5** Evaluar Cloudflare como capa extra de CDN/proteccion

---

## Resumen de Progreso

### Completado (automatizable)
- Build de produccion verificado (0 errores, 0 warnings)
- 27/27 tests pasando
- Security headers implementados (HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
- Cache-Control headers en API publica
- GitHub Actions CI/CD pipeline creado
- SEO metadata completa (OpenGraph, Twitter Cards, keywords)
- robots.txt y sitemap.xml generados via Next.js
- .env files protegidos en .gitignore

### Pendiente (requiere accion manual)
- Comprar dominio y configurar DNS
- Actualizar env vars en Vercel Dashboard con dominio final
- Agregar dominio en Vercel Dashboard
- Habilitar Vercel Analytics
- Integrar Sentry para error tracking
- Configurar email transaccional (Resend/SendGrid)
- Branch protection en GitHub
- Verificar Google Search Console

---

## Prioridades

| Prioridad | Tarea | Esfuerzo | Estado |
|-----------|-------|----------|--------|
| **P0** | Build de produccion sin errores | Bajo | DONE |
| **P0** | Comprar y configurar dominio | Bajo | PENDIENTE |
| **P0** | Actualizar env vars y config | Bajo | PARCIAL |
| **P1** | Headers de seguridad | Medio | DONE |
| **P1** | Monitoreo (Sentry/Analytics) | Medio | PENDIENTE |
| **P1** | Email transaccional real | Medio | PENDIENTE |
| **P2** | GitHub Actions CI/CD | Medio | DONE |
| **P2** | SEO y metadata | Bajo | DONE |
| **P3** | Performance tuning | Variable | PARCIAL |

---

## Variables de Entorno Requeridas en Produccion

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

## Archivos Modificados/Creados

| Archivo | Cambio |
|---------|--------|
| `next.config.ts` | Security headers + allowedOrigins actualizado |
| `src/app/layout.tsx` | Metadata SEO completa (OG, Twitter, keywords) |
| `src/app/robots.ts` | robots.txt via Next.js route handler |
| `src/app/sitemap.ts` | sitemap.xml via Next.js route handler |
| `src/app/api/prompts/public/route.ts` | Cache-Control headers |
| `.github/workflows/ci.yml` | CI pipeline (lint + typecheck + test + build) |

---

*Documento generado: 2026-02-16*
*Ultima actualizacion: 2026-02-16*
