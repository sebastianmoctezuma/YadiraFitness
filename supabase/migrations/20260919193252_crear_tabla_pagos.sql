-- Registro propio de cada pago. Stripe es la fuente de verdad; esta tabla
-- es el registro consultable que llena el webhook (upsert por sesión).
create table public.pagos (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text not null unique,
  stripe_payment_intent text,
  reto text not null,
  monto integer not null,          -- centavos
  moneda text not null default 'mxn',
  descuento integer not null default 0, -- centavos
  estado text not null check (estado in ('pagado', 'procesando', 'fallido')),
  nombre text,
  email text,
  telefono text,
  modalidad text,
  creado timestamptz not null default now(),
  actualizado timestamptz not null default now()
);

-- Candado: RLS sin políticas = nadie pasa por la API pública.
-- Solo el rol de servicio (llave secreta, solo servidor) toca la tabla.
alter table public.pagos enable row level security;
revoke all on table public.pagos from anon, authenticated;
grant all on table public.pagos to service_role;
