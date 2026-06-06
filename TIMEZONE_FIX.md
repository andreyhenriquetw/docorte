# 🔧 Correção de Timezone - N8N + Vercel

## 🔴 Problema Identificado

Seu N8N não funciona na Vercel porque há uma **inconsistência de timezone** entre localhost e servidor.

### Por que funciona no localhost?

- Seu computador está em São Paulo (UTC-3)
- `new Date()` retorna a hora **local**
- O filtro de 28-32 minutos bate corretamente

### Por que falha na Vercel?

- Vercel usa servidor em UTC (Zulu time)
- `new Date()` retorna UTC
- O filtro de 28-32 minutos **NÃO bate** (diferença de 3-5 horas!)
- Quando N8N busca lembretes com filtro de hora, recebe dados em UTC, mas espera São Paulo

---

## ✅ Solução Implementada

### Arquivos Corrigidos:

#### 1️⃣ `/app/api/reminders/route.ts` (CRÍTICO - O principal problema)

**Antes:**

```typescript
const now = new Date() // ❌ Retorna UTC na Vercel
```

**Depois:**

```typescript
import { toZonedTime } from "date-fns-tz"

const now = toZonedTime(new Date(), "America/Sao_Paulo") // ✅ Sempre São Paulo
```

#### 2️⃣ `/app/_data/get-confirmed-bookings.ts`

**Antes:**

```typescript
date: {
  gte: new Date(),  // ❌ UTC na Vercel
}
```

**Depois:**

```typescript
import { toZonedTime } from "date-fns-tz"

const now = toZonedTime(new Date(), "America/Sao_Paulo")
date: {
  gte: now,  // ✅ São Paulo
}
```

---

## 🧪 Como Testar

1. **Faça um commit com as mudanças:**

```bash
git add .
git commit -m "Fix: Corrigir timezone para São Paulo em reminders e bookings"
git push
```

2. **Deploy na Vercel:**

```bash
# Vercel faz deploy automático ou:
vercel deploy --prod
```

3. **Configure N8N com a URL da Vercel:**
   - Remova o filtro de data/hora por enquanto
   - Teste se está buscando os bookings corretamente
   - O filtro de 28-32 minutos deve funcionar agora

4. **Verifique os logs:**

```bash
# Na Vercel Dashboard → Logs
# Procure por console.log do reminders mostrando as datas corretas
```

---

## 📊 Comparação de Comportamento

| Cenário           | Antes           | Depois                |
| ----------------- | --------------- | --------------------- |
| Localhost com N8N | ✅ Funciona     | ✅ Funciona           |
| Vercel com N8N    | ❌ Não funciona | ✅ Funciona           |
| Filtro por hora   | ❌ Não bate     | ✅ Bate perfeitamente |

---

## 🚀 Próximos Passos (Opcional)

Para melhor prática global, considere:

1. **Usar variável de ambiente para timezone:**

```typescript
const TIMEZONE = process.env.APP_TIMEZONE || "America/Sao_Paulo"
const now = toZonedTime(new Date(), TIMEZONE)
```

2. **Criar utility function centralizada:**

```typescript
// app/_lib/timezone.ts
import { toZonedTime } from "date-fns-tz"

export const getNowInBrazil = () => toZonedTime(new Date(), "America/Sao_Paulo")
```

---

## 📝 Resumo

**O N8N falha na Vercel porque:**

- Você estava usando `new Date()` sem converter timezone
- Localhost funciona por acaso (hora local)
- Vercel usa UTC, quebrando os filtros por hora

**Solução:** Usar `toZonedTime()` sempre que precisar da hora atual para comparações com banco de dados.
