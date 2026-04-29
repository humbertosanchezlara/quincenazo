create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  transaction_type text not null check (transaction_type in ('income', 'expense')),
  color text not null default '#1f6a52',
  icon text,
  created_at timestamptz not null default timezone('utc', now()),
  unique (user_id, name, transaction_type)
);

create table if not exists public.subcategories (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (category_id, name)
);

create table if not exists public.recurring_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  amount numeric(12,2) not null check (amount > 0),
  transaction_type text not null check (transaction_type in ('income', 'expense')),
  category_id uuid references public.categories(id) on delete set null,
  subcategory_id uuid references public.subcategories(id) on delete set null,
  payee text not null,
  notes text,
  frequency text not null default 'monthly' check (frequency in ('monthly')),
  day_of_month int not null check (day_of_month between 1 and 28),
  start_date date not null,
  end_date date,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount numeric(12,2) not null check (amount > 0),
  occurred_on date not null,
  transaction_type text not null check (transaction_type in ('income', 'expense')),
  category_id uuid references public.categories(id) on delete set null,
  subcategory_id uuid references public.subcategories(id) on delete set null,
  payee text not null,
  notes text,
  recurring_transaction_id uuid references public.recurring_transactions(id) on delete set null,
  recurring_instance_key text,
  is_recurring_generated boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists transactions_recurring_instance_unique
  on public.transactions(user_id, recurring_instance_key)
  where recurring_instance_key is not null;

create table if not exists public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  month date not null,
  planned_amount numeric(12,2) not null check (planned_amount > 0),
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, category_id, month)
);

create table if not exists public.audit_log (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  entity_type text not null,
  entity_id text not null,
  action text not null,
  payload jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as '
begin
  new.updated_at = timezone(''utc'', now());
  return new;
end;
';

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles
for each row execute function public.handle_updated_at();

drop trigger if exists transactions_updated_at on public.transactions;
create trigger transactions_updated_at before update on public.transactions
for each row execute function public.handle_updated_at();

drop trigger if exists budgets_updated_at on public.budgets;
create trigger budgets_updated_at before update on public.budgets
for each row execute function public.handle_updated_at();

drop trigger if exists recurring_transactions_updated_at on public.recurring_transactions;
create trigger recurring_transactions_updated_at before update on public.recurring_transactions
for each row execute function public.handle_updated_at();

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.subcategories enable row level security;
alter table public.transactions enable row level security;
alter table public.budgets enable row level security;
alter table public.recurring_transactions enable row level security;
alter table public.audit_log enable row level security;

drop policy if exists "profiles are owned by user" on public.profiles;
create policy "profiles are owned by user" on public.profiles
for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "categories are owned by user" on public.categories;
create policy "categories are owned by user" on public.categories
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "subcategories are owned by user" on public.subcategories;
create policy "subcategories are owned by user" on public.subcategories
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "transactions are owned by user" on public.transactions;
create policy "transactions are owned by user" on public.transactions
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "budgets are owned by user" on public.budgets;
create policy "budgets are owned by user" on public.budgets
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "recurring transactions are owned by user" on public.recurring_transactions;
create policy "recurring transactions are owned by user" on public.recurring_transactions
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "audit log is owned by user" on public.audit_log;
create policy "audit log is owned by user" on public.audit_log
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
