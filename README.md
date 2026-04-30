# Quincenazo

Quincenazo es una app de finanzas personales en `Next.js + Supabase`, en español mexicano, para registrar ingresos y gastos manualmente, comparar presupuesto vs real y entender en qué se va la quincena.

## Stack

- `Next.js 16` con App Router, TypeScript y Tailwind CSS
- `Supabase Auth + Postgres`
- `Server Actions` para captura, presupuestos, categorías, recurrencias y auditoría
- `Recharts` para visualización de gasto vs presupuesto

## Funcionalidades incluidas

- Inicio de sesión con Google OAuth o correo + contraseña por Supabase
- Captura manual de ingresos y gastos
- Categorías y subcategorías personalizables
- Presupuestos mensuales por categoría
- Dashboard con tarjetas de resumen, gráficas y alertas de sobre gasto
- Reportes mensuales y variación por categoría
- Reglas de movimientos recurrentes
- Sugerencias de categoría por historial de texto
- Bitácora de auditoría

## Variables de entorno

Copia `.env.example` a `.env.local` y completa:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Supabase

1. Crea un proyecto en Supabase.
2. Corre la migración en `supabase/migrations/202604291620_quincenazo_schema.sql`.
3. En Authentication:
   - habilita Email
   - habilita Google en `Authentication > Providers`
   - configura los redirect URLs:
     - `http://localhost:3000/auth/callback`
     - `https://tu-dominio.vercel.app/auth/callback`
   - configura el `Site URL` según tu ambiente público, por ejemplo `https://tu-dominio.vercel.app`

## Desarrollo

```bash
npm install
npm run dev
```

## Verificación sugerida

```bash
npm run lint
npm run typecheck
npm run build
```
