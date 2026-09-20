-- Un cobro doble genuino (la misma persona paga el mismo reto dos veces) no
-- se puede impedir desde el sitio: pasa en Stripe, en momentos distintos y
-- quizá desde otro dispositivo. Lo que sí se puede es no descubrirlo por un
-- reclamo. El webhook marca aquí la fila cuando ya existe un pago del mismo
-- correo para el mismo reto, para que Yadira lo revise y reembolse.
alter table public.pagos
  add column duplicado boolean not null default false;

-- La consulta del webhook es siempre (email, reto) entre pagos ya cobrados.
create index pagos_email_reto_idx on public.pagos (email, reto);
