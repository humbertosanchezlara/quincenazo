-- Ampliar el límite de day_of_month de 1-28 a 1-31.
-- La lógica de sync ya usa Math.min(day, lastDayOfMonth) para meses cortos.
alter table public.recurring_transactions
  drop constraint if exists recurring_transactions_day_of_month_check;

alter table public.recurring_transactions
  add constraint recurring_transactions_day_of_month_check
  check (day_of_month between 1 and 31);
