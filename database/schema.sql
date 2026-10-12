-- PostgreSQL schema for the owner-controlled catalog service.
-- Product specifications are separated from commercial offers.
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL CHECK (category IN ('cpu','gpu','motherboard','ram','storage','psu','case','cooler')),
  brand TEXT NOT NULL,
  model TEXT,
  name TEXT NOT NULL,
  specifications JSONB NOT NULL DEFAULT '{}'::jsonb,
  image_url TEXT,
  reliability TEXT NOT NULL DEFAULT 'unverified',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sources (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  terms_url TEXT,
  enabled BOOLEAN NOT NULL DEFAULT false,
  reliability TEXT NOT NULL DEFAULT 'unverified',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS offers (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  source_id TEXT NOT NULL REFERENCES sources(id),
  store TEXT NOT NULL,
  product_url TEXT,
  price NUMERIC(12,2) NOT NULL CHECK (price >= 0),
  currency CHAR(3) NOT NULL DEFAULT 'EUR',
  shipping_cost NUMERIC(12,2),
  availability TEXT NOT NULL DEFAULT 'unknown',
  verified BOOLEAN NOT NULL DEFAULT false,
  last_checked_at TIMESTAMPTZ,
  UNIQUE (product_id, source_id, store)
);

CREATE TABLE IF NOT EXISTS sync_runs (
  id BIGSERIAL PRIMARY KEY,
  source_id TEXT REFERENCES sources(id),
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  status TEXT NOT NULL,
  imported_count INTEGER NOT NULL DEFAULT 0,
  error_message TEXT
);

CREATE INDEX IF NOT EXISTS offers_product_id_idx ON offers(product_id);
CREATE INDEX IF NOT EXISTS offers_availability_idx ON offers(availability);
