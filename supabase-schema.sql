create table if not exists public.recipes (
  id text primary key,
  owner_id text not null,
  payload jsonb not null,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists recipes_owner_id_idx on public.recipes (owner_id);

alter table public.recipes enable row level security;

drop policy if exists "public read recipes" on public.recipes;
create policy "public read recipes"
on public.recipes
for select
using (true);

drop policy if exists "public write recipes" on public.recipes;
create policy "public write recipes"
on public.recipes
for insert
with check (true);

drop policy if exists "public update recipes" on public.recipes;
create policy "public update recipes"
on public.recipes
for update
using (true)
with check (true);

drop policy if exists "public delete recipes" on public.recipes;
create policy "public delete recipes"
on public.recipes
for delete
using (true);
