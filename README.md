# Contas de Casa

Sistema familiar: dinheiro, agenda, lista de compras e fotos compartilhadas.

## Usuários
| Nome | Senha |
|------|-------|
| Pedro | pedro123 |
| Carol | carol123 |
| Lucas | lucas123 |
| Letícia | leticia123 |

---

## Configurar Supabase (uma vez)

### 1. Criar projeto em https://supabase.com

### 2. SQL Editor → cole e rode TUDO:

```sql
CREATE TABLE IF NOT EXISTS lancamentos (
  id text PRIMARY KEY,
  tipo text NOT NULL,
  descricao text NOT NULL,
  valor float8 NOT NULL,
  data date NOT NULL,
  categoria text NOT NULL,
  criado_por text
);

CREATE TABLE IF NOT EXISTS categorias (
  id text PRIMARY KEY,
  nome text NOT NULL,
  tipo text NOT NULL,
  cor text DEFAULT '#64748b',
  icone text DEFAULT '📋'
);

CREATE TABLE IF NOT EXISTS eventos (
  id text PRIMARY KEY,
  titulo text NOT NULL,
  data date NOT NULL,
  hora text,
  categoria text,
  notas text,
  criado_por text
);

CREATE TABLE IF NOT EXISTS compras (
  id text PRIMARY KEY,
  item text NOT NULL,
  feito boolean DEFAULT false,
  criado_por text
);

CREATE TABLE IF NOT EXISTS metas (
  id text PRIMARY KEY DEFAULT 'meta_mes',
  valor float8 DEFAULT 0,
  mes text
);

CREATE TABLE IF NOT EXISTS fotos (
  id text PRIMARY KEY,
  nome text,
  path text NOT NULL,
  legenda text,
  criado_por text,
  criado_em timestamptz DEFAULT now()
);

ALTER TABLE lancamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE compras ENABLE ROW LEVEL SECURITY;
ALTER TABLE metas ENABLE ROW LEVEL SECURITY;
ALTER TABLE fotos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "p1" ON lancamentos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "p2" ON categorias FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "p3" ON eventos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "p4" ON compras FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "p5" ON metas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "p6" ON fotos FOR ALL USING (true) WITH CHECK (true);
```

### 3. Criar o Storage de fotos
1. Menu **Storage** → **New bucket**
2. Nome: `fotos`
3. Marque **Public bucket** (para conseguir ver e baixar)
4. Create

Depois em **Policies** do bucket `fotos`, se pedir, permita upload/leitura para todos (ou rode no SQL):

```sql
CREATE POLICY "fotos_select" ON storage.objects FOR SELECT USING (bucket_id = 'fotos');
CREATE POLICY "fotos_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'fotos');
CREATE POLICY "fotos_delete" ON storage.objects FOR DELETE USING (bucket_id = 'fotos');
```

### 4. Project Settings → API
Copie **Project URL** e **anon public** key.

### 5. No index.html cole:

```js
const SUPABASE_URL = 'https://xxxx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJ...';
```

Deploy de novo no Netlify.
